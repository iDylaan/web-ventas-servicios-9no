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