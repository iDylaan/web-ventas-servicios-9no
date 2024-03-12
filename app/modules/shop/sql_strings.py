class Sql_Strings():

    GET_PRODUCT_COUNT_BY_ID = (
        "SELECT COUNT(*) AS count "
        "FROM servicios "
        "WHERE id = %(id_producto)s"
    )
    GET_PRODUCT_IMAGE_BY_ID = (
        "SELECT srv_imagen, srv_nombre_imagen "
        "FROM servicios "
        "WHERE id = %(id_producto)s"
    )
    GET_PRODCTS = (
        """
        SELECT 
            id, 
            srv_nom AS "titulo", 
            srv_desc AS "descripcion", 
            srv_desc_corta AS "descripcion_previa", 
            srv_info AS "info", 
            srv_precio AS "precio", 
            srv_imagen AS "imagen", 
            srv_nombre_imagen AS "nombre_imgen", 
            dt_creado AS "fecha_creado", 
            activo
        FROM servicios
        """
    )
    
    GET_PRODCT_BY_ID = (
        """
        SELECT 
            id, 
            srv_nom AS "titulo", 
            srv_desc AS "descripcion", 
            srv_desc_corta AS "descripcion_previa", 
            srv_info AS "info", 
            srv_precio AS "precio", 
            srv_imagen AS "imagen", 
            srv_nombre_imagen AS "nombre_imgen", 
            dt_creado AS "fecha_creado", 
            activo
        FROM servicios
        WHERE id = %(id_producto)s
        """
    )