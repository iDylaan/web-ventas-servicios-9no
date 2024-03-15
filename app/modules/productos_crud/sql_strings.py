class Sql_Strings():
    INSERT_NEW_PRODUCT = (
        "INSERT INTO servicios (srv_nom, srv_desc, srv_desc_corta, srv_info, srv_precio) VALUES "
        "(%(titulo)s, %(descripcion)s, %(descripcion_corta)s, %(info)s, %(precio)s)"
    )
    
    UPDATE_PRODUCT_BY_ID = (
        "UPDATE servicios SET "
        "   srv_nom = %(titulo)s, "
        "   srv_desc = %(descripcion)s, "
        "   srv_desc_corta = %(descripcion_corta)s, "
        "   srv_info = %(info)s, "
        "   srv_precio = %(precio)s " 
        "WHERE id = %(id_producto)s"
    )
    
    GET_PRODUCT_COUNT_BY_ID = (
        "SELECT COUNT(*) AS count "
        "FROM servicios "
        "WHERE id = %(id_producto)s"
    )
    
    
    UPDATE_PRODUCT_IMAGE_BY_ID = (
        "UPDATE servicios SET "
        "srv_imagen = %(imagen)s, "
        "srv_nombre_imagen = %(nombre_imagen)s"
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