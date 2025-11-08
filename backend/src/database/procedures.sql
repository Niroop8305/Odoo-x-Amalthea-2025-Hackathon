-- =====================================================
-- WorkZen HRMS - Stored Procedures
-- =====================================================

-- Drop existing procedure if it exists
DROP PROCEDURE IF EXISTS calculate_leave_days;

-- =====================================================
-- Procedure: Calculate Leave Days (excluding weekends)
-- =====================================================
CREATE PROCEDURE calculate_leave_days(
    IN p_start_date DATE,
    IN p_end_date DATE,
    OUT p_total_days DECIMAL(5,2)
)
BEGIN
    DECLARE v_current_date DATE;
    DECLARE v_day_count DECIMAL(5,2);
    
    SET v_current_date = p_start_date;
    SET v_day_count = 0;
    
    WHILE v_current_date <= p_end_date DO
        IF DAYOFWEEK(v_current_date) NOT IN (1, 7) THEN
            SET v_day_count = v_day_count + 1;
        END IF;
        SET v_current_date = DATE_ADD(v_current_date, INTERVAL 1 DAY);
    END WHILE;
    
    SET p_total_days = v_day_count;
END;
