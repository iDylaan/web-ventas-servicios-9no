class Sql_Strings():
    DESIRED_PRODUCT = (
        """
        SELECT 
            pd.id_usuario AS id_usuario,
            s.id AS id_servicio,
            s.srv_nom AS titulo, 
            s.srv_desc AS descripcion, 
            s.srv_desc_corta AS descripcion_previa, 
            s.srv_info AS info, 
            s.srv_precio AS precio,
            s.srv_nombre_imagen AS nombre_imagen
        FROM 
            productos_deseados pd
        JOIN 
            servicios s ON pd.id_servicio = s.id
        WHERE 
            pd.id_usuario = %(id_usuario)s;
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