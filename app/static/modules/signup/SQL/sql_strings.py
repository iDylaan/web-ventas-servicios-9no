class Sql_Strings():
    GET_USER_BY_EMAIL = (
        "SELECT COUNT(*) FROM usuarios "
        "WHERE email = %(email)s"
    )
    
    INSERT_USER = (
        "INSERT INTO usuarios (nombre_usuario, email, password) VALUES "
        "(%(username)s, %(email)s, %(password)s)"
    )