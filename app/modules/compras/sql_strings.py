class Sql_Strings():
    DESIRED_PRODUCT = (
        """
        SELECT *
        FROM vista_productos_deseados
        WHERE 
            id_usuario = %(id_usuario)s;
        """
    )

    
    GET_USER_COUNT_BY_ID = (
        "SELECT COUNT(*) AS count " 
        "FROM usuarios "
        "WHERE id = %(id)s"
    )


    INSERT_BUY_PRODUCTS = (
        "INSERT INTO compras (cantidad, id_servicio, id_usuario) VALUES {}"
    )


    GET_PRODUCT_COUNT_BY_ID = (
        "SELECT COUNT(*) AS count "
        "FROM servicios "
        "WHERE id = %(id_producto)s"
    )

    GET_MIS_COMPRAS_BY_USER_ID = (
        "SELECT * "
        "FROM vista_compras_servicios " 
        "WHERE id_usuario = %(user_id)s"
    )