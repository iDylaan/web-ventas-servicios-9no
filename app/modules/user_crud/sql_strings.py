class Sql_Strings():
    INSERT_NEW_USER = (
        "INSERT INTO usuarios (nombre_usuario, email, password, admin) VALUES "
        "(%(nombre_usuario)s, %(email)s, %(password)s, %(admin)s)"
    )
    
    UPDATE_USER_BY_ID = (
        "UPDATE usuario SET "
        "   nombre_usuario = %(nombre_usuario)s, "
        "   email = %(email)s, "
        "   password = %(password)s, "
        "   admin = %(admin)s " 
        "WHERE id = %(id_usuario)s"
    )
    
    GET_USER_COUNT_BY_ID = (
        "SELECT COUNT(*) AS count "
        "FROM usuarios "
        "WHERE id = %(id_usuario)s"
    )
    
    
    UPDATE_USER_IMAGE_BY_ID = (
        "UPDATE usuarios SET "
        "image_bin = %(imagen)s, "
        "image_name = %(nombre_imagen)s"
        "WHERE id = %(id_usuario)s"
    )
    
    GET_USER_IMAGE_BY_ID = (
        "SELECT image_bin, image_name, image_url "
        "FROM usuarios "
        "WHERE id = %(id_usuario)s"
    )