CREATE OR REPLACE FUNCTION create_user(
    p_name TEXT,
    p_email TEXT,
    p_password TEXT
) RETURNS UUID AS $$
DECLARE uid UUID;
BEGIN
    INSERT INTO users(name, email, password)
    VALUES (p_name, p_email, p_password)
    RETURNING id INTO uid;
    
    RETURN uid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_project(
    p_name TEXT,
    p_description TEXT,
    p_owner UUID
) RETURNS UUID AS $$
DECLARE pid UUID;
BEGIN
    INSERT INTO projects(name, description, owner_id)
    VALUES (p_name, p_description, p_owner)
    RETURNING id INTO pid;

    RETURN pid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_task(
    p_project UUID,
    p_title TEXT,
    p_description TEXT,
    p_assigned_to UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE tid UUID;
BEGIN
    INSERT INTO tasks(project_id, title, description, assigned_to)
    VALUES (p_project, p_title, p_description, p_assigned_to)
    RETURNING id INTO tid;

    RETURN tid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_comment(
    p_task UUID,
    p_user UUID,
    p_message TEXT
) RETURNS UUID AS $$
DECLARE cid UUID;
BEGIN
    INSERT INTO comments(task_id, user_id, message)
    VALUES (p_task, p_user, p_message)
    RETURNING id INTO cid;

    RETURN cid;
END;
$$ LANGUAGE plpgsql;
