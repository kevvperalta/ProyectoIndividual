import os
import pymysql
import pymysql.cursors
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# ========== CONFIGURACIÓN ==========
load_dotenv()
app = Flask(__name__, static_folder='../frontend/html', static_url_path='')
CORS(app)
# ========== CONEXIÓN BD ==========
def get_db_connection():
    """Conectar a MySQL - funciona con local y Railway"""
    try:
        # Para producción (Railway)
        if 'DATABASE_URL' in os.environ:
            db_url = os.environ['DATABASE_URL']
            if db_url.startswith('mysql://'):
                import re
                match = re.match(r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
                if match:
                    config = {
                        'host': match.group(3),
                        'user': match.group(1),
                        'password': match.group(2),
                        'database': match.group(5),
                        'port': int(match.group(4)),
                        'charset': 'utf8mb4',
                        'cursorclass': pymysql.cursors.DictCursor
                    }
                    return pymysql.connect(**config)
        
        # Para desarrollo local
        config = {
            'host': os.getenv('MYSQL_HOST', 'localhost'),
            'user': os.getenv('MYSQL_USER', 'root'),
            'password': os.getenv('MYSQL_PASSWORD', ''),
            'database': os.getenv('MYSQL_DB', 'explora_peru'),
            'port': int(os.getenv('MYSQL_PORT', 3306)),
            'charset': 'utf8mb4',
            'cursorclass': pymysql.cursors.DictCursor
        }
        
        return pymysql.connect(**config)
        
    except Exception as e:
        print(f" Error conectando a MySQL: {e}")
        return None

# ========== RUTAS API ==========
@app.route('/api/health', methods=['GET'])
def health_check():
    """Verificar que la API funciona"""
    return jsonify({
        'status': 'healthy',
        'service': 'Explora Perú API',
        'version': '1.0.0'
    })

@app.route('/api/contacto', methods=['POST'])
def crear_mensaje():
    """Recibir mensajes del formulario"""
    try:
        data = request.json
        nombre = data.get('nombre', '').strip()
        email = data.get('email', '').strip()
        mensaje = data.get('mensaje', '').strip()
        
        # Validaciones
        if not nombre:
            return jsonify({'success': False, 'message': 'El nombre es obligatorio'}), 400
        if not email:
            return jsonify({'success': False, 'message': 'El email es obligatorio'}), 400
        if not mensaje:
            return jsonify({'success': False, 'message': 'El mensaje es obligatorio'}), 400
        if len(mensaje) < 10:
            return jsonify({'success': False, 'message': 'El mensaje debe tener al menos 10 caracteres'}), 400
        
        # Guardar en BD
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Error de conexión a la base de datos'}), 500
        
        with conn.cursor() as cursor:
            sql = "INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES (%s, %s, %s)"
            cursor.execute(sql, (nombre, email, mensaje))
            conn.commit()
            mensaje_id = cursor.lastrowid
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Mensaje enviado correctamente',
            'data': {
                'id': mensaje_id,
                'nombre': nombre,
                'email': email
            }
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error del servidor: {str(e)}'}), 500

@app.route('/api/contacto', methods=['GET'])
def listar_mensajes():
    """Listar mensajes (para pruebas)"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Error de conexión a BD'}), 500
        
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, nombre, email, mensaje, fecha_envio FROM mensajes_contacto ORDER BY fecha_envio DESC")
            mensajes = cursor.fetchall()
        
        conn.close()
        return jsonify({'success': True, 'count': len(mensajes), 'data': mensajes})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ========== SERVIR FRONTEND ==========
@app.route('/')
def servir_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:filename>')
def servir_pagina(filename):
    """Servir páginas HTML"""
    if filename.endswith('.html'):
        return send_from_directory(app.static_folder, filename)
    # Intentar servir otros archivos
    try:
        return send_from_directory(app.static_folder, filename)
    except:
        return jsonify({'success': False, 'message': 'Archivo no encontrado'}), 404

@app.route('/css/<path:filename>')
def servir_css(filename):
    return send_from_directory('../frontend/css', filename)

@app.route('/js/<path:filename>')
def servir_js(filename):
    return send_from_directory('../frontend/js', filename)

# ========== MANEJO DE ERRORES ==========
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Recurso no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# ========== INICIAR APP ==========
if __name__ == '__main__':
    # Verificar conexión a BD
    print("🔍 Probando conexión a MySQL...")
    conn = get_db_connection()
    if conn:
        print(" Conexión a MySQL exitosa")
        conn.close()
    else:
        print("❌ No se pudo conectar a MySQL")
        print("   Revisa: 1) MySQL está ejecutándose, 2) .env tiene credenciales correctas")
    
    # Información
    port = int(os.getenv('PORT', 5000))
    print(f"\n{'='*60}")
    print(" EXPLORA PERÚ - Backend Simple")
    print(f"{'='*60}")
    print(f" Entorno: {os.getenv('FLASK_ENV', 'development')}")
    print(f" Frontend: {app.static_folder}")
    print(f" URL principal: http://localhost:{port}")
    print(f" Health check: http://localhost:{port}/api/health")
    print(f" Prueba BD: http://localhost:{port}/api/contacto (GET)")
    print(f"{'='*60}")
    print("Presiona Ctrl+C para detener el servidor\n")
    
    # Iniciar
    app.run(host='0.0.0.0', port=port, debug=True)