class Sql_Strings():
    INSERT_NEW_USER = (
        "INSERT INTO usuarios (nombre_usuario, email, password, admin) VALUES "
        "(%(nombre_usuario)s, %(email)s, %(password)s, %(admin)s)"
        "RETURNING id "
    )
    
    UPDATE_USER_BY_ID = (
        "UPDATE usuarios SET "
        "   nombre_usuario = %(nombre_usuario)s, "
        "   email = %(email)s, "
        "   admin = %(admin)s " 
        "WHERE id = %(id_usuario)s"
    )
    
    GET_USER_COUNT_BY_ID = (
        "SELECT COUNT(*) AS count "
        "FROM usuarios "
        "WHERE id = %(id_usuario)s"
    )

    GET_USER_COUNT_BY_EMAIL = (
        "SELECT COUNT(*) FROM usuarios "
        "WHERE email = %(email)s"
    )
    
    
    UPDATE_USER_IMAGE_BY_ID = (
        "UPDATE usuarios SET "
        "image_url = %(imagen)s "
        "WHERE id = %(id_usuario)s"
    )
    
    GET_USER_IMAGE_BY_ID = (
        "SELECT image_url "
        "FROM usuarios "
        "WHERE id = %(id_usuario)s"
    )
    GET_USERS = (
        """
        SELECT 
            id, 
            nombre_usuario, 
            email, 
            "admin", 
            image_url AS "imagen"
        FROM usuarios;
        """
    )
    GET_USERS_BY_ID = (
        """
        SELECT 
            id, 
            nombre_usuario, 
            email, 
            "admin", 
            image_url AS "imagen"
        FROM usuarios
        WHERE id = %(id_usuario)s;
        """
    )