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
  p_title TEXT,
  p_description TEXT,
  p_project_id UUID,
  p_created_by UUID,
  p_assigned_to UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id) THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  IF p_assigned_to IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM users WHERE id = p_assigned_to) THEN
    RAISE EXCEPTION 'Assigned user not found';
  END IF;

  INSERT INTO tasks (
    title,
    description,
    project_id,
    created_by,
    assigned_to
  )
  VALUES (
    p_title,
    p_description,
    p_project_id,
    p_created_by,
    p_assigned_to
  )
  RETURNING id INTO v_task_id;

  RETURN v_task_id;
END;
$$;


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

CREATE OR REPLACE FUNCTION assign_task_to_user(
  p_task_id UUID,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tasks WHERE id = p_task_id) THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  UPDATE tasks
  SET assigned_to = p_user_id
  WHERE id = p_task_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_task_status(p_task_id UUID, p_status TEXT)
RETURNS UUID AS $$
DECLARE
task_exists BOOLEAN;
BEGIN

  -- Check if task exists
    SELECT EXISTS(SELECT 1 FROM tasks WHERE id = p_task_id) INTO task_exists;

    IF NOT task_exists THEN
        RAISE EXCEPTION 'Task with ID % does not exist', p_task_id;
    END IF;

  UPDATE tasks
  SET status = p_status
  WHERE id = p_task_id;

  RETURN p_task_id;
END;
$$ LANGUAGE plpgsql;

