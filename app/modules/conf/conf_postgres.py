import sys
from app import app
import psycopg2


def qry(query, params=None, fetchone=False):
    try:
        conn = psycopg2.connect(
            host=app.config["PGL_HOST"],
            database=app.config["PGL_DB"],
            user=app.config["PGL_USER"],
            password=app.config["PGL_PASS"],
            port=app.config["PGL_PORT"]
        )
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        if fetchone:
            result = cursor.fetchone()
            if result:
                column_names = [desc[0] for desc in cursor.description]
                result = dict(zip(column_names, result))
        else:
            column_names = [desc[0] for desc in cursor.description]
            records = cursor.fetchall()
            result = [dict(zip(column_names, record)) for record in records]
        conn.commit()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        raise Exception(f'Error al ejecutar consulta en @qry/{e} en la linea {sys.exc_info()[-1].tb_lineno}')
    
def sql(sql, params=None):
    try:
        conn = psycopg2.connect(
            host=app.config["PGL_HOST"],
            database=app.config["PGL_DB"],
            user=app.config["PGL_USER"],
            password=app.config["PGL_PASS"],
            port=app.config["PGL_PORT"]
        )
        cursor = conn.cursor()

        if params:
            cursor.execute(sql, params)
        else:
            cursor.execute(sql)

        conn.commit()
        rows_affected = cursor.rowcount
        cursor.close()
        conn.close()
        return int(rows_affected)
    except Exception as e:
        raise Exception(f"Error al ejecutar la consulta en @sql/{e} en la linea {sys.exc_info()[-1].tb_lineno}")
    
def sqlv2(sql, params=None, return_id=False):
    try:
        conn = psycopg2.connect(
            host=app.config["PGL_HOST"],
            database=app.config["PGL_DB"],
            user=app.config["PGL_USER"],
            password=app.config["PGL_PASS"],
            port=app.config["PGL_PORT"]
        )
        cursor = conn.cursor()

        if params:
            cursor.execute(sql, params)
        else:
            cursor.execute(sql)

        rows_affected = cursor.rowcount
        id_of_new_row = None
        if return_id:
            id_of_new_row = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        return rows_affected, id_of_new_row

    except Exception as e:
        raise Exception(f"Error al ejecutar la consulta en @sqlv2/{e} en la linea {sys.exc_info()[-1].tb_lineno}")

