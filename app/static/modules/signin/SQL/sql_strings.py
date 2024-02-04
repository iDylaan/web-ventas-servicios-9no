class Sql_Strings():
    GET_USER_BY_EMAIL = (
        "SELECT * FROM usuarios "
        "WHERE email = %(email)s"
    )