-- Phase 2: Views for commonly used complex queries

-- View 1: Tenant Details with Room Information
CREATE OR REPLACE VIEW tenant_details AS
SELECT 
    t.tenant_id,
    t.name,
    t.phone,
    t.aadhaar,
    t.join_date,
    b.bed_id,
    b.bed_number,
    b.status as bed_status,
    r.room_id,
    r.room_type,
    r.rent,
    r.status as room_status
FROM TENANT t
JOIN BED b ON t.bed_id = b.bed_id
JOIN ROOM r ON b.room_id = r.room_id;

-- View 2: Payment Summary by Tenant
CREATE OR REPLACE VIEW payment_summary AS
SELECT 
    t.tenant_id,
    t.name,
    t.phone,
    COUNT(p.payment_id) as total_payments,
    SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as total_paid,
    SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END) as pending_amount,
    MAX(p.payment_date) as last_payment_date,
    AVG(CASE WHEN p.status = 'completed' THEN p.amount END) as average_payment
FROM TENANT t
LEFT JOIN PAYMENT p ON t.tenant_id = p.tenant_id
GROUP BY t.tenant_id, t.name, t.phone;

-- View 3: Room Occupancy Analytics
CREATE OR REPLACE VIEW room_occupancy_analytics AS
SELECT 
    r.room_id,
    r.room_type,
    r.rent,
    r.status as room_status,
    COUNT(b.bed_id) as total_beds,
    COUNT(t.tenant_id) as occupied_beds,
    (COUNT(b.bed_id) - COUNT(t.tenant_id)) as available_beds,
    ROUND((COUNT(t.tenant_id) * 100.0 / COUNT(b.bed_id)), 2) as occupancy_rate,
    SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as monthly_revenue
FROM ROOM r
LEFT JOIN BED b ON r.room_id = b.room_id
LEFT JOIN TENANT t ON b.bed_id = t.bed_id
LEFT JOIN PAYMENT p ON t.tenant_id = p.tenant_id 
    AND DATE_FORMAT(p.payment_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m')
    AND p.status = 'completed'
GROUP BY r.room_id, r.room_type, r.rent, r.status
ORDER BY occupancy_rate DESC;

-- View 4: Complaint Analytics
CREATE OR REPLACE VIEW complaint_analytics AS
SELECT 
    c.complaint_id,
    c.description,
    c.status as complaint_status,
    c.created_at,
    t.tenant_id,
    t.name as tenant_name,
    t.phone as tenant_phone,
    b.bed_number,
    r.room_type,
    DATEDIFF(CURRENT_DATE, c.created_at) as days_open
FROM COMPLAINT c
JOIN TENANT t ON c.tenant_id = t.tenant_id
JOIN BED b ON t.bed_id = b.bed_id
JOIN ROOM r ON b.room_id = r.room_id
ORDER BY c.created_at DESC;

-- View 5: Financial Dashboard
CREATE OR REPLACE VIEW financial_dashboard AS
SELECT 
    DATE_FORMAT(payment_date, '%Y-%m') as month,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as revenue,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    AVG(CASE WHEN status = 'completed' THEN amount END) as average_payment_amount
FROM PAYMENT
WHERE payment_date >= DATE_SUB(CURRENT_DATE, INTERVAL 24 MONTH)
GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
ORDER BY month DESC;

-- Phase 2: Triggers for data integrity

-- Trigger 1: Auto-update bed status when tenant is assigned
DELIMITER //
CREATE TRIGGER tr_tenant_insert_update_bed_status
AFTER INSERT ON TENANT
FOR EACH ROW
BEGIN
    UPDATE BED 
    SET status = 'occupied' 
    WHERE bed_id = NEW.bed_id;
END//
DELIMITER ;

-- Trigger 2: Auto-update bed status when tenant is deleted
DELIMITER //
CREATE TRIGGER tr_tenant_delete_update_bed_status
AFTER DELETE ON TENANT
FOR EACH ROW
BEGIN
    UPDATE BED 
    SET status = 'available' 
    WHERE bed_id = OLD.bed_id;
END//
DELIMITER ;

-- Trigger 3: Auto-update bed status when tenant's bed is changed
DELIMITER //
CREATE TRIGGER tr_tenant_update_bed_status
AFTER UPDATE ON TENANT
FOR EACH ROW
BEGIN
    -- Free the old bed
    IF OLD.bed_id != NEW.bed_id THEN
        UPDATE BED SET status = 'available' WHERE bed_id = OLD.bed_id;
        UPDATE BED SET status = 'occupied' WHERE bed_id = NEW.bed_id;
    END IF;
END//
DELIMITER ;

-- Trigger 4: Log payment changes for audit
DELIMITER //
CREATE TRIGGER tr_payment_audit_log
AFTER INSERT ON PAYMENT
FOR EACH ROW
BEGIN
    INSERT INTO PAYMENT_AUDIT (payment_id, tenant_id, amount, payment_date, payment_mode, status, action_type, created_at)
    VALUES (NEW.payment_id, NEW.tenant_id, NEW.amount, NEW.payment_date, NEW.payment_mode, NEW.status, 'CREATE', NOW());
END//
DELIMITER ;

-- Phase 3: Stored Procedures for complex operations

-- Procedure 1: Process monthly rent collection
DELIMITER //
CREATE PROCEDURE sp_process_monthly_rent()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tenant_id_var INT;
    DECLARE bed_id_var INT;
    DECLARE rent_amount DECIMAL(10,2);
    DECLARE tenant_cursor CURSOR FOR 
        SELECT t.tenant_id, t.bed_id, r.rent
        FROM TENANT t
        JOIN BED b ON t.bed_id = b.bed_id
        JOIN ROOM r ON b.room_id = r.room_id
        WHERE t.tenant_id NOT IN (
            SELECT DISTINCT tenant_id FROM PAYMENT 
            WHERE DATE_FORMAT(payment_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m')
            AND status = 'completed'
        );
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Create temporary table for results
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_rent_results (
        tenant_id INT,
        bed_id INT,
        rent_amount DECIMAL(10,2),
        payment_status VARCHAR(20),
        message VARCHAR(255)
    );
    
    OPEN tenant_cursor;
    
    read_loop: LOOP
        FETCH tenant_cursor INTO tenant_id_var, bed_id_var, rent_amount;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Insert payment record for monthly rent
        INSERT INTO PAYMENT (tenant_id, amount, payment_date, payment_mode, status)
        VALUES (tenant_id_var, rent_amount, CURRENT_DATE, 'monthly_rent', 'pending');
        
        -- Log the result
        INSERT INTO temp_rent_results (tenant_id, bed_id, rent_amount, payment_status, message)
        VALUES (tenant_id_var, bed_id_var, rent_amount, 'pending', 'Monthly rent generated');
        
    END LOOP;
    
    CLOSE tenant_cursor;
    
    -- Return results
    SELECT * FROM temp_rent_results ORDER BY tenant_id;
    
    -- Clean up
    DROP TEMPORARY TABLE IF EXISTS temp_rent_results;
END//
DELIMITER ;

-- Procedure 2: Generate occupancy report
DELIMITER //
CREATE PROCEDURE sp_generate_occupancy_report(IN report_date DATE)
BEGIN
    SELECT 
        r.room_id,
        r.room_type,
        r.rent,
        COUNT(b.bed_id) as total_beds,
        COUNT(t.tenant_id) as occupied_beds,
        (COUNT(b.bed_id) - COUNT(t.tenant_id)) as available_beds,
        ROUND((COUNT(t.tenant_id) * 100.0 / COUNT(b.bed_id)), 2) as occupancy_rate,
        CASE 
            WHEN (COUNT(t.tenant_id) * 100.0 / COUNT(b.bed_id)) >= 90 THEN 'High Occupancy'
            WHEN (COUNT(t.tenant_id) * 100.0 / COUNT(b.bed_id)) >= 70 THEN 'Medium Occupancy'
            ELSE 'Low Occupancy'
        END as occupancy_category
    FROM ROOM r
    LEFT JOIN BED b ON r.room_id = b.room_id
    LEFT JOIN TENANT t ON b.bed_id = t.bed_id
    GROUP BY r.room_id, r.room_type, r.rent
    ORDER BY occupancy_rate DESC;
END//
DELIMITER ;

-- Procedure 3: Update tenant payment status
DELIMITER //
CREATE PROCEDURE sp_update_tenant_payment_status(IN tenant_id_param INT, IN new_status VARCHAR(20))
BEGIN
    DECLARE payment_count INT;
    
    -- Count payments to update
    SELECT COUNT(*) INTO payment_count
    FROM PAYMENT 
    WHERE tenant_id = tenant_id_param AND status = 'pending';
    
    IF payment_count > 0 THEN
        -- Update all pending payments for the tenant
        UPDATE PAYMENT 
        SET status = new_status,
            payment_date = CASE 
                WHEN new_status = 'completed' THEN CURRENT_DATE
                ELSE payment_date
            END
        WHERE tenant_id = tenant_id_param AND status = 'pending';
        
        SELECT ROW_COUNT() as payments_updated, 
               'Payment status updated successfully' as message;
    ELSE
        SELECT 0 as payments_updated, 
               'No pending payments found for this tenant' as message;
    END IF;
END//
DELIMITER ;

-- Phase 3: Cursor operations for batch processing

-- Cursor Example: Batch update room status based on occupancy
DELIMITER //
CREATE PROCEDURE sp_batch_update_room_status()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE room_id_var INT;
    DECLARE occupied_beds INT;
    DECLARE total_beds INT;
    DECLARE occupancy_rate DECIMAL(5,2);
    
    DECLARE room_cursor CURSOR FOR 
        SELECT 
            r.room_id,
            COUNT(t.tenant_id) as occupied_beds,
            COUNT(b.bed_id) as total_beds,
            (COUNT(t.tenant_id) * 100.0 / COUNT(b.bed_id)) as occupancy_rate
        FROM ROOM r
        LEFT JOIN BED b ON r.room_id = b.room_id
        LEFT JOIN TENANT t ON b.bed_id = t.bed_id
        GROUP BY r.room_id
        HAVING total_beds > 0;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Create results table
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_room_updates (
        room_id INT,
        old_status VARCHAR(20),
        new_status VARCHAR(20),
        occupancy_rate DECIMAL(5,2),
        update_message VARCHAR(255)
    );
    
    OPEN room_cursor;
    
    update_loop: LOOP
        FETCH room_cursor INTO room_id_var, occupied_beds, total_beds, occupancy_rate;
        IF done THEN
            LEAVE update_loop;
        END IF;
        
        -- Get current room status
        SELECT status INTO @old_status FROM ROOM WHERE room_id = room_id_var;
        
        -- Determine new status based on occupancy
        SET @new_status = CASE 
            WHEN occupancy_rate = 0 THEN 'available'
            WHEN occupancy_rate = 100 THEN 'full'
            ELSE 'partially_occupied'
        END;
        
        -- Update room status if changed
        IF @old_status != @new_status THEN
            UPDATE ROOM SET status = @new_status WHERE room_id = room_id_var;
            
            INSERT INTO temp_room_updates (room_id, old_status, new_status, occupancy_rate, update_message)
            VALUES (room_id_var, @old_status, @new_status, occupancy_rate, 'Status updated based on occupancy');
        ELSE
            INSERT INTO temp_room_updates (room_id, old_status, new_status, occupancy_rate, update_message)
            VALUES (room_id_var, @old_status, @new_status, occupancy_rate, 'No status change needed');
        END IF;
        
    END LOOP;
    
    CLOSE room_cursor;
    
    -- Return results
    SELECT * FROM temp_room_updates ORDER BY room_id;
    
    -- Clean up
    DROP TEMPORARY TABLE IF EXISTS temp_room_updates;
END//
DELIMITER ;

-- Additional table for payment audit (needed for trigger)
CREATE TABLE IF NOT EXISTS PAYMENT_AUDIT (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT,
    tenant_id INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    payment_mode VARCHAR(30),
    status VARCHAR(20),
    action_type VARCHAR(20),
    created_at DATETIME,
    INDEX idx_payment_id (payment_id),
    INDEX idx_tenant_id (tenant_id)
);
