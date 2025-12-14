import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from './Header';
import './LessonContent.css';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const moduleContent = {
  'modulo-1': {
    title: 'Módulo 1: Fundamentos de C++',
    lessons: [
      {
        id: 'leccion-1-1',
        title: 'Configuración del entorno (compiladores, CMake, IDEs)',
        content: `
          <h3>Instalación de Compiladores</h3>
          <p>Para comenzar a programar en C++, necesitas instalar un compilador. Las opciones más populares son:</p>
          <ul>
            <li><strong>GCC (GNU Compiler Collection):</strong> Disponible en Linux, macOS y Windows (a través de MinGW o MSYS2)</li>
            <li><strong>Clang:</strong> Alternativa moderna, disponible en múltiples plataformas</li>
            <li><strong>Microsoft Visual C++ (MSVC):</strong> Compilador oficial de Microsoft para Windows</li>
          </ul>
          
          <h3>CMake: Sistema de Build</h3>
          <p>CMake es una herramienta multiplataforma que permite generar archivos de build para diferentes sistemas:</p>
          <pre><code># CMakeLists.txt básico
cmake_minimum_required(VERSION 3.10)
project(MiProyecto)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(main main.cpp)</code></pre>
          
          <h3>IDEs Recomendados</h3>
          <ul>
            <li><strong>Visual Studio Code:</strong> Editor ligero con extensiones para C++</li>
            <li><strong>CLion:</strong> IDE profesional de JetBrains</li>
            <li><strong>Visual Studio:</strong> IDE completo de Microsoft</li>
            <li><strong>Code::Blocks:</strong> IDE multiplataforma y open source</li>
          </ul>
          
          <h3>Tu Primera Compilación</h3>
          <pre><code># Compilación manual
g++ -std=c++17 -o programa main.cpp

# Con CMake
mkdir build
cd build
cmake ..
cmake --build .</code></pre>
        `
      },
      {
        id: 'leccion-1-2',
        title: 'Sintaxis básica y tipos',
        content: `
          <h3>Tipos de Datos Fundamentales</h3>
          <p>C++ ofrece varios tipos de datos básicos:</p>
          <ul>
            <li><strong>int:</strong> Enteros (32 bits típicamente)</li>
            <li><strong>float/double:</strong> Números de punto flotante</li>
            <li><strong>char:</strong> Caracteres (8 bits)</li>
            <li><strong>bool:</strong> Valores booleanos (true/false)</li>
            <li><strong>void:</strong> Tipo sin valor</li>
          </ul>
          
          <h3>Ejemplo de Código</h3>
          <pre><code>#include &lt;iostream&gt;

int main() {
    int numero = 42;
    double decimal = 3.14;
    char letra = 'A';
    bool esCierto = true;
    
    std::cout << "Número: " << numero << std::endl;
    std::cout << "Decimal: " << decimal << std::endl;
    std::cout << "Letra: " << letra << std::endl;
    std::cout << "Booleano: " << esCierto << std::endl;
    
    return 0;
}</code></pre>
          
          <h3>Declaraciones de Variables</h3>
          <p>En C++ moderno, puedes usar <code>auto</code> para deducción de tipos:</p>
          <pre><code>auto x = 10;        // int
auto y = 3.14;      // double
auto z = "Hola";    // const char*</code></pre>
          
          <h3>Constantes</h3>
          <pre><code>const int MAX_SIZE = 100;
constexpr double PI = 3.14159265359;  // Evaluado en tiempo de compilación</code></pre>
        `
      },
      {
        id: 'leccion-1-3',
        title: 'Control de flujo y funciones',
        content: `
          <h3>Estructuras de Control</h3>
          
          <h4>Condicionales</h4>
          <pre><code>int edad = 18;

if (edad >= 18) {
    std::cout << "Eres mayor de edad" << std::endl;
} else if (edad >= 13) {
    std::cout << "Eres adolescente" << std::endl;
} else {
    std::cout << "Eres un niño" << std::endl;
}

// Switch
int opcion = 2;
switch (opcion) {
    case 1:
        std::cout << "Opción 1" << std::endl;
        break;
    case 2:
        std::cout << "Opción 2" << std::endl;
        break;
    default:
        std::cout << "Opción inválida" << std::endl;
}</code></pre>
          
          <h4>Bucles</h4>
          <pre><code>// For tradicional
for (int i = 0; i < 10; i++) {
    std::cout << i << " ";
}

// Range-based for (C++11)
std::vector&lt;int&gt; numeros = {1, 2, 3, 4, 5};
for (int num : numeros) {
    std::cout << num << " ";
}

// While
int contador = 0;
while (contador < 5) {
    std::cout << contador << " ";
    contador++;
}

// Do-while
do {
    // código
} while (condicion);</code></pre>
          
          <h3>Funciones</h3>
          <pre><code>// Función básica
int sumar(int a, int b) {
    return a + b;
}

// Función con parámetros por referencia
void incrementar(int& valor) {
    valor++;
}

// Función con parámetros por valor constante
void imprimir(const std::string& texto) {
    std::cout << texto << std::endl;
}

// Función con valores por defecto
int potencia(int base, int exponente = 2) {
    int resultado = 1;
    for (int i = 0; i < exponente; i++) {
        resultado *= base;
    }
    return resultado;
}

// Uso
int main() {
    int resultado = sumar(5, 3);  // 8
    int num = 5;
    incrementar(num);              // num ahora es 6
    imprimir("Hola Mundo");
    int cuadrado = potencia(4);    // 16 (exponente = 2 por defecto)
    return 0;
}</code></pre>
          
          <h3>Sobrecarga de Funciones</h3>
          <pre><code>int sumar(int a, int b) {
    return a + b;
}

double sumar(double a, double b) {
    return a + b;
}

// El compilador elige la función apropiada
sumar(1, 2);      // Llama a sumar(int, int)
sumar(1.5, 2.5);  // Llama a sumar(double, double)</code></pre>
        `
      }
    ]
  },
  // C# course modules
  'csharp-1': {
    title: 'Módulo 1: Introducción a C#',
    lessons: [
      { id: 'csharp-1-1', title: 'Sintaxis básica y tipos', content: `
        <h3>Hola C#</h3>
        <pre><code>using System;\n\nclass Program {\n  static void Main(){\n    Console.WriteLine("Hola C#");\n  }\n}</code></pre>
        <h3>Tipos Primitivos</h3>
        <ul><li>int, double, decimal</li><li>bool</li><li>string</li><li>var (inferencia)</li></ul>
      `},
      { id: 'csharp-1-2', title: 'Estructuras de control y métodos', content: `
        <h3>Control de flujo</h3>
        <pre><code>for (int i=0; i<3; i++) Console.WriteLine(i);\nif (x > 0) { /* ... */ } else { /* ... */ }</code></pre>
        <h3>Métodos</h3>
        <pre><code>static int Sumar(int a, int b) => a + b;</code></pre>
      `},
    ],
  },
  'csharp-2': {
    title: 'Módulo 2: POO en C#',
    lessons: [
      { id: 'csharp-2-1', title: 'Clases, propiedades y constructores', content: `
        <pre><code>public class Persona {\n  public string Nombre { get; set; }\n  public int Edad { get; }\n  public Persona(string nombre, int edad){ Nombre = nombre; Edad = edad; }\n}</code></pre>
      `},
      { id: 'csharp-2-2', title: 'Herencia e interfaces', content: `
        <pre><code>interface IAnimal { void HacerSonido(); }\nclass Perro : IAnimal { public void HacerSonido() => Console.WriteLine("Guau"); }</code></pre>
      `},
    ],
  },
  'csharp-3': {
    title: 'Módulo 3: Colecciones y LINQ',
    lessons: [
      { id: 'csharp-3-1', title: 'List, Dictionary y IEnumerable', content: `
        <pre><code>var numeros = new List<int> {1,2,3};\nvar mapa = new Dictionary<string,int>{{"a",1}};</code></pre>
      `},
      { id: 'csharp-3-2', title: 'Consultas LINQ y proyecciones', content: `
        <pre><code>var pares = numeros.Where(n => n % 2 == 0).Select(n => n*2).ToList();</code></pre>
      `},
    ],
  },
  'csharp-4': {
    title: 'Módulo 4: Excepciones y Depuración',
    lessons: [
      { id: 'csharp-4-1', title: 'Manejo de excepciones', content: `
        <pre><code>try { /* ... */ } catch(Exception ex) { Console.WriteLine(ex.Message); } finally { /* ... */ }</code></pre>
      `},
      { id: 'csharp-4-2', title: 'Depuración en Visual Studio', content: `
        <p>Uso de breakpoints, inspección de variables, Call Stack, Watch, y Exception Settings.</p>
      `},
    ],
  },
  'csharp-5': {
    title: 'Módulo 5: Interfaces y Delegados',
    lessons: [
      { id: 'csharp-5-1', title: 'Interfaces, records y patrones', content: `
        <pre><code>public record Usuario(string Nombre, int Edad);\nobject o = 5; if (o is int n && n > 0) Console.WriteLine(n);</code></pre>
      `},
      { id: 'csharp-5-2', title: 'Delegados y eventos', content: `
        <pre><code>public delegate void Notificador(string msg);\npublic event Notificador? OnNotificar;</code></pre>
      `},
    ],
  },
  'csharp-6': {
    title: 'Módulo 6: Tasks y Async/Await',
    lessons: [
      { id: 'csharp-6-1', title: 'Programación asíncrona con Tasks', content: `
        <pre><code>Task<int> TrabajoAsync(){ return Task.FromResult(42); }</code></pre>
      `},
      { id: 'csharp-6-2', title: 'Async/Await y buenas prácticas', content: `
        <pre><code>var resultado = await TrabajoAsync(); // Configurar await con cancellation tokens.</code></pre>
      `},
    ],
  },
  'csharp-7': {
    title: 'Módulo 7: Entity Framework',
    lessons: [
      { id: 'csharp-7-1', title: 'DbContext, entidades y migraciones', content: `
        <pre><code>public class AppDb : DbContext { public DbSet<Usuario> Usuarios => Set<Usuario>(); }</code></pre>
      `},
      { id: 'csharp-7-2', title: 'Consultas, relaciones y rendimiento', content: `
        <pre><code>var usuarios = await db.Usuarios.AsNoTracking().Where(u => u.Activo).ToListAsync();</code></pre>
      `},
    ],
  },
  'csharp-8': {
    title: 'Módulo 8: Proyecto .NET',
    lessons: [
      { id: 'csharp-8-1', title: 'Arquitectura y capas', content: `
        <p>Estructura por capas: Domain, Application, Infrastructure, Web/API. Inyección de dependencias.</p>
      `},
      { id: 'csharp-8-2', title: 'Publicación y despliegue', content: `
        <pre><code>dotnet publish -c Release -r win-x64 --self-contained false</code></pre>
      `},
    ],
  },
  // C course modules
  'c-1': {
    title: 'Módulo 1: Introducción a C',
    lessons: [
      { id: 'c-1-1', title: 'Hola Mundo y compilación', content: `
        <pre><code>#include <stdio.h>\nint main(){\n  printf("Hola C\\n");\n  return 0;\n}</code></pre>
        <p>Compila con: <code>gcc main.c -o app</code></p>
      `},
      { id: 'c-1-2', title: 'Entrada/Salida básica', content: `
        <pre><code>#include <stdio.h>\nint main(){\n  int x;\n  scanf("%d", &x);\n  printf("Valor: %d\\n", x);\n  return 0;\n}</code></pre>
      `},
    ],
  },
  'c-2': {
    title: 'Módulo 2: Tipos y Variables',
    lessons: [
      { id: 'c-2-1', title: 'Tipos primitivos y constantes', content: `
        <pre><code>int a = 10;\nconst double PI = 3.14159;\nchar c = 'A';\n_Bool ok = 1;</code></pre>
      `},
      { id: 'c-2-2', title: 'Operadores y conversión', content: `
        <pre><code>double r = (double) a / 3; // cast</code></pre>
      `},
    ],
  },
  'c-3': {
    title: 'Módulo 3: Control de Flujo',
    lessons: [
      { id: 'c-3-1', title: 'if/else y switch', content: `
        <pre><code>if (a > 0) { /* ... */ } else { /* ... */ }\nswitch(op){ case 1: break; default: break; }</code></pre>
      `},
      { id: 'c-3-2', title: 'for, while, do-while', content: `
        <pre><code>for(int i=0;i<10;i++){}\nwhile(cond){}\ndo{}while(cond);</code></pre>
      `},
    ],
  },
  'c-4': {
    title: 'Módulo 4: Funciones',
    lessons: [
      { id: 'c-4-1', title: 'Declaración, ámbito y prototipos', content: `
        <pre><code>int sumar(int a, int b);\nint main(){ return sumar(2,3);}\nint sumar(int a,int b){ return a+b; }</code></pre>
      `},
      { id: 'c-4-2', title: 'Parámetros por puntero y arrays', content: `
        <pre><code>void inc(int* x){ (*x)++; }\nvoid setAll(int* a, int n){ for(int i=0;i<n;i++) a[i]=0; }</code></pre>
      `},
    ],
  },
  'c-5': {
    title: 'Módulo 5: Punteros',
    lessons: [
      { id: 'c-5-1', title: 'Dirección y desreferenciación', content: `
        <pre><code>int x=5; int* p=&x; printf("%d", *p);</code></pre>
      `},
      { id: 'c-5-2', title: 'Punteros y arrays/strings', content: `
        <pre><code>char s[] = "hola"; char* ps = s; printf("%c", *(ps+1));</code></pre>
      `},
    ],
  },
  'c-6': {
    title: 'Módulo 6: Memoria Dinámica',
    lessons: [
      { id: 'c-6-1', title: 'malloc, calloc, realloc', content: `
        <pre><code>int* v = malloc(10*sizeof *v); v = realloc(v, 20*sizeof *v); free(v);</code></pre>
      `},
      { id: 'c-6-2', title: 'Gestión y fugas de memoria', content: `
        <p>Reglas: cada malloc/calloc/realloc debe tener un free correspondiente.</p>
      `},
    ],
  },
  'c-7': {
    title: 'Módulo 7: Estructuras de Datos',
    lessons: [
      { id: 'c-7-1', title: 'struct y typedef', content: `
        <pre><code>typedef struct { int id; char nombre[32]; } Usuario;</code></pre>
      `},
      { id: 'c-7-2', title: 'Listas enlazadas básicas', content: `
        <pre><code>typedef struct Nodo{ int v; struct Nodo* sig; } Nodo;</code></pre>
      `},
    ],
  },
  'c-8': {
    title: 'Módulo 8: Proyecto Final',
    lessons: [
      { id: 'c-8-1', title: 'Diseño y plan de proyecto', content: `<p>Define requerimientos, módulos y diseño de datos.</p>`},
      { id: 'c-8-2', title: 'Compilación y entrega', content: `<pre><code>gcc -O2 -Wall -Wextra src/*.c -o bin/app</code></pre>`},
    ],
  },
  'modulo-2': {
    title: 'Módulo 2: POO en C++',
    lessons: [
      {
        id: 'leccion-2-1',
        title: 'Clases, objetos, constructores y destructores',
        content: `
          <h3>¿Qué es una Clase?</h3>
          <p>Una clase es una plantilla que define la estructura y comportamiento de los objetos. Combina datos (atributos) y funciones (métodos) que operan sobre esos datos.</p>
          
          <h3>Definición de Clases</h3>
          <pre><code>class Persona {
private:
    std::string nombre;
    int edad;
    
public:
    // Constructor
    Persona(const std::string& nombre, int edad) 
        : nombre(nombre), edad(edad) {
        std::cout << "Persona creada: " << nombre << std::endl;
    }
    
    // Destructor
    ~Persona() {
        std::cout << "Persona destruida: " << nombre << std::endl;
    }
    
    // Getters
    std::string getNombre() const { return nombre; }
    int getEdad() const { return edad; }
    
    // Setters
    void setNombre(const std::string& nombre) { this->nombre = nombre; }
    void setEdad(int edad) { this->edad = edad; }
    
    // Método
    void presentarse() const {
        std::cout << "Soy " << nombre << " y tengo " << edad << " años." << std::endl;
    }
};</code></pre>
          
          <h3>Creación de Objetos</h3>
          <pre><code>int main() {
    // Crear objeto en el stack
    Persona persona1("Juan", 25);
    persona1.presentarse();
    
    // Crear objeto en el heap
    Persona* persona2 = new Persona("María", 30);
    persona2->presentarse();
    delete persona2;  // Liberar memoria
    
    return 0;
}</code></pre>
          
          <h3>Constructores</h3>
          <pre><code>class Rectangulo {
private:
    double ancho;
    double alto;
    
public:
    // Constructor por defecto
    Rectangulo() : ancho(0), alto(0) {}
    
    // Constructor con parámetros
    Rectangulo(double ancho, double alto) 
        : ancho(ancho), alto(alto) {}
    
    // Constructor de copia
    Rectangulo(const Rectangulo& otro) 
        : ancho(otro.ancho), alto(otro.alto) {
        std::cout << "Constructor de copia llamado" << std::endl;
    }
    
    // Constructor de movimiento (C++11)
    Rectangulo(Rectangulo&& otro) noexcept
        : ancho(otro.ancho), alto(otro.alto) {
        otro.ancho = 0;
        otro.alto = 0;
        std::cout << "Constructor de movimiento llamado" << std::endl;
    }
    
    double area() const { return ancho * alto; }
};</code></pre>
          
          <h3>Orden de Construcción y Destrucción</h3>
          <p>Los objetos se construyen en el orden de declaración y se destruyen en orden inverso.</p>
        `
      },
      {
        id: 'leccion-2-2',
        title: 'Encapsulamiento, herencia, polimorfismo',
        content: `
          <h3>Encapsulamiento</h3>
          <p>El encapsulamiento oculta los detalles internos de implementación y expone solo una interfaz controlada.</p>
          
          <pre><code>class CuentaBancaria {
private:
    double saldo;  // Datos privados, no accesibles desde fuera
    
public:
    CuentaBancaria(double saldoInicial) : saldo(saldoInicial) {}
    
    void depositar(double cantidad) {
        if (cantidad > 0) {
            saldo += cantidad;
        }
    }
    
    bool retirar(double cantidad) {
        if (cantidad > 0 && cantidad <= saldo) {
            saldo -= cantidad;
            return true;
        }
        return false;
    }
    
    double getSaldo() const { return saldo; }  // Solo lectura
};</code></pre>
          
          <h3>Herencia</h3>
          <p>Permite crear nuevas clases basadas en clases existentes, reutilizando código.</p>
          
          <pre><code>// Clase base
class Animal {
protected:
    std::string nombre;
    
public:
    Animal(const std::string& nombre) : nombre(nombre) {}
    
    virtual void hacerSonido() {
        std::cout << nombre << " hace un sonido" << std::endl;
    }
    
    virtual ~Animal() = default;  // Destructor virtual para polimorfismo
};

// Clase derivada
class Perro : public Animal {
public:
    Perro(const std::string& nombre) : Animal(nombre) {}
    
    void hacerSonido() override {  // Override explícito (C++11)
        std::cout << nombre << " ladra: ¡Guau!" << std::endl;
    }
    
    void ladrar() {
        std::cout << nombre << " está ladrando" << std::endl;
    }
};

// Clase derivada
class Gato : public Animal {
public:
    Gato(const std::string& nombre) : Animal(nombre) {}
    
    void hacerSonido() override {
        std::cout << nombre << " maúlla: ¡Miau!" << std::endl;
    }
};</code></pre>
          
          <h3>Polimorfismo</h3>
          <p>El polimorfismo permite que diferentes clases se comporten de manera distinta mediante la misma interfaz.</p>
          
          <pre><code>int main() {
    // Polimorfismo con punteros
    Animal* animales[] = {
        new Perro("Fido"),
        new Gato("Whiskers"),
        new Perro("Max")
    };
    
    for (int i = 0; i < 3; i++) {
        animales[i]->hacerSonido();  // Cada uno hace su sonido
    }
    
    // Limpiar memoria
    for (int i = 0; i < 3; i++) {
        delete animales[i];
    }
    
    return 0;
}</code></pre>
          
          <h3>Clases Abstractas</h3>
          <pre><code>class Forma {
public:
    // Función virtual pura = clase abstracta
    virtual double area() const = 0;
    virtual double perimetro() const = 0;
    virtual ~Forma() = default;
};

class Circulo : public Forma {
private:
    double radio;
    
public:
    Circulo(double radio) : radio(radio) {}
    
    double area() const override {
        return 3.14159 * radio * radio;
    }
    
    double perimetro() const override {
        return 2 * 3.14159 * radio;
    }
};</code></pre>
          
          <h3>Modificadores de Acceso</h3>
          <ul>
            <li><strong>public:</strong> Accesible desde cualquier lugar</li>
            <li><strong>protected:</strong> Accesible desde la clase y sus derivadas</li>
            <li><strong>private:</strong> Accesible solo desde dentro de la clase</li>
          </ul>
        `
      },
      {
        id: 'leccion-2-3',
        title: 'RAII y gestión de recursos',
        content: `
          <h3>¿Qué es RAII?</h3>
          <p><strong>RAII (Resource Acquisition Is Initialization)</strong> es un principio fundamental de C++ que garantiza que los recursos se adquieran durante la inicialización y se liberen automáticamente cuando el objeto sale de alcance.</p>
          
          <h3>Problema sin RAII</h3>
          <pre><code>void funcionPeligrosa() {
    int* memoria = new int[1000];  // Asignar memoria
    
    // Si ocurre una excepción aquí...
    procesarDatos();
    
    delete[] memoria;  // Esto podría no ejecutarse
}</code></pre>
          
          <h3>Solución con RAII</h3>
          <pre><code>class GestionMemoria {
private:
    int* memoria;
    
public:
    GestionMemoria(size_t tamanio) {
        memoria = new int[tamanio];
        std::cout << "Memoria asignada" << std::endl;
    }
    
    // Destructor asegura limpieza
    ~GestionMemoria() {
        delete[] memoria;
        std::cout << "Memoria liberada" << std::endl;
    }
    
    // Eliminar copia (Rule of Three/Five)
    GestionMemoria(const GestionMemoria&) = delete;
    GestionMemoria& operator=(const GestionMemoria&) = delete;
};

void funcionSegura() {
    GestionMemoria mem(1000);  // Memoria asignada automáticamente
    
    procesarDatos();
    
    // Memoria liberada automáticamente al salir de la función
}</code></pre>
          
          <h3>RAII con Archivos</h3>
          <pre><code>#include &lt;fstream&gt;

class GestionArchivo {
private:
    std::ofstream archivo;
    
public:
    GestionArchivo(const std::string& nombre) 
        : archivo(nombre) {
        if (!archivo.is_open()) {
            throw std::runtime_error("No se pudo abrir el archivo");
        }
    }
    
    ~GestionArchivo() {
        if (archivo.is_open()) {
            archivo.close();  // Se cierra automáticamente
        }
    }
    
    void escribir(const std::string& texto) {
        archivo << texto << std::endl;
    }
};

int main() {
    try {
        GestionArchivo arch("datos.txt");
        arch.escribir("Hola Mundo");
        // El archivo se cierra automáticamente
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}</code></pre>
          
          <h3>Ventajas de RAII</h3>
          <ul>
            <li>Automatiza la gestión de recursos</li>
            <li>Previene memory leaks</li>
            <li>Seguro con excepciones</li>
            <li>Hace el código más limpio y mantenible</li>
          </ul>
          
          <h3>Rule of Three/Five</h3>
          <p>Si defines un destructor, constructor de copia, o operador de asignación, deberías considerar los cinco especiales:</p>
          <ul>
            <li>Destructor</li>
            <li>Constructor de copia</li>
            <li>Operador de asignación de copia</li>
            <li>Constructor de movimiento (C++11)</li>
            <li>Operador de asignación de movimiento (C++11)</li>
          </ul>
        `
      }
    ]
  },
  'modulo-3': {
    title: 'Módulo 3: STL y Templates',
    lessons: [
      {
        id: 'leccion-3-1',
        title: 'Contenedores (vector, map, unordered_map, etc.)',
        content: `
          <h3>Standard Template Library (STL)</h3>
          <p>La STL proporciona contenedores, iteradores y algoritmos listos para usar.</p>
          
          <h3>Vector - Array Dinámico</h3>
          <pre><code>#include &lt;vector&gt;
#include &lt;iostream&gt;

int main() {
    // Crear vector
    std::vector&lt;int&gt; numeros;
    
    // Agregar elementos
    numeros.push_back(1);
    numeros.push_back(2);
    numeros.push_back(3);
    
    // Crear con valores iniciales
    std::vector&lt;int&gt; otro = {4, 5, 6};
    
    // Acceder a elementos
    std::cout << numeros[0] << std::endl;  // 1
    std::cout << numeros.at(1) << std::endl;  // 2 (con verificación de límites)
    
    // Tamaño
    std::cout << "Tamaño: " << numeros.size() << std::endl;
    
    // Iterar
    for (size_t i = 0; i < numeros.size(); i++) {
        std::cout << numeros[i] << " ";
    }
    
    // Range-based for
    for (int num : numeros) {
        std::cout << num << " ";
    }
    
    return 0;
}</code></pre>
          
          <h3>Map - Diccionario Ordenado</h3>
          <pre><code>#include &lt;map&gt;
#include &lt;string&gt;

int main() {
    std::map&lt;std::string, int&gt; edades;
    
    // Insertar elementos
    edades["Juan"] = 25;
    edades["María"] = 30;
    edades["Pedro"] = 28;
    
    // Acceder
    std::cout << edades["Juan"] << std::endl;  // 25
    
    // Buscar (más seguro)
    auto it = edades.find("María");
    if (it != edades.end()) {
        std::cout << "Edad de María: " << it->second << std::endl;
    }
    
    // Iterar
    for (const auto& par : edades) {
        std::cout << par.first << ": " << par.second << std::endl;
    }
    
    return 0;
}</code></pre>
          
          <h3>Unordered Map - Hash Table</h3>
          <pre><code>#include &lt;unordered_map&gt;

int main() {
    std::unordered_map&lt;std::string, std::string&gt; telefonos;
    
    telefonos["Juan"] = "555-1234";
    telefonos["María"] = "555-5678";
    
    // Más rápido que map para búsquedas, pero no ordenado
    std::cout << telefonos["Juan"] << std::endl;
    
    return 0;
}</code></pre>
          
          <h3>Otros Contenedores</h3>
          <ul>
            <li><strong>list:</strong> Lista doblemente enlazada</li>
            <li><strong>deque:</strong> Cola doble (double-ended queue)</li>
            <li><strong>set:</strong> Conjunto ordenado de elementos únicos</li>
            <li><strong>unordered_set:</strong> Conjunto basado en hash</li>
            <li><strong>stack:</strong> Pila (LIFO)</li>
            <li><strong>queue:</strong> Cola (FIFO)</li>
          </ul>
        `
      },
      {
        id: 'leccion-3-2',
        title: 'Iteradores, algoritmos y rangos',
        content: `
          <h3>Iteradores</h3>
          <p>Los iteradores proporcionan una forma generalizada de recorrer contenedores.</p>
          
          <pre><code>#include &lt;vector&gt;
#include &lt;iostream&gt;

int main() {
    std::vector&lt;int&gt; numeros = {1, 2, 3, 4, 5};
    
    // Iterador tradicional
    for (std::vector&lt;int&gt;::iterator it = numeros.begin(); 
         it != numeros.end(); ++it) {
        std::cout << *it << " ";
    }
    
    // Con auto (más simple)
    for (auto it = numeros.begin(); it != numeros.end(); ++it) {
        std::cout << *it << " ";
    }
    
    // Iterador constante (solo lectura)
    for (auto it = numeros.cbegin(); it != numeros.cend(); ++it) {
        // *it solo lectura
        std::cout << *it << " ";
    }
    
    // Reverse iterator
    for (auto it = numeros.rbegin(); it != numeros.rend(); ++it) {
        std::cout << *it << " ";  // Imprime al revés
    }
    
    return 0;
}</code></pre>
          
          <h3>Algoritmos STL</h3>
          <pre><code>#include &lt;algorithm&gt;
#include &lt;vector&gt;
#include &lt;iostream&gt;

int main() {
    std::vector&lt;int&gt; numeros = {5, 2, 8, 1, 9, 3};
    
    // Ordenar
    std::sort(numeros.begin(), numeros.end());
    // Resultado: {1, 2, 3, 5, 8, 9}
    
    // Buscar
    auto it = std::find(numeros.begin(), numeros.end(), 8);
    if (it != numeros.end()) {
        std::cout << "Encontrado en posición: " << 
            (it - numeros.begin()) << std::endl;
    }
    
    // Contar
    int cantidad = std::count(numeros.begin(), numeros.end(), 3);
    
    // Transformar
    std::vector&lt;int&gt; duplicados;
    std::transform(numeros.begin(), numeros.end(), 
                   std::back_inserter(duplicados),
                   [](int n) { return n * 2; });
    
    // All of, any of, none of (C++11)
    bool todosPositivos = std::all_of(numeros.begin(), numeros.end(),
                                      [](int n) { return n > 0; });
    
    return 0;
}</code></pre>
          
          <h3>Ranges (C++20)</h3>
          <pre><code>#include &lt;ranges&gt;
#include &lt;vector&gt;
#include &lt;iostream&gt;

int main() {
    std::vector&lt;int&gt; numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Filtrar números pares y multiplicar por 2
    auto resultado = numeros 
        | std::ranges::views::filter([](int n) { return n % 2 == 0; })
        | std::ranges::views::transform([](int n) { return n * 2; });
    
    for (int valor : resultado) {
        std::cout << valor << " ";  // 4, 8, 12, 16, 20
    }
    
    return 0;
}</code></pre>
          
          <h3>Algoritmos Útiles</h3>
          <ul>
            <li><strong>std::sort:</strong> Ordenar elementos</li>
            <li><strong>std::find:</strong> Buscar elemento</li>
            <li><strong>std::accumulate:</strong> Sumar/acumular valores</li>
            <li><strong>std::max_element / min_element:</strong> Encontrar máximo/mínimo</li>
            <li><strong>std::reverse:</strong> Invertir secuencia</li>
            <li><strong>std::unique:</strong> Eliminar duplicados consecutivos</li>
          </ul>
        `
      },
      {
        id: 'leccion-3-3',
        title: 'Plantillas, deducción de tipos y constexpr',
        content: `
          <h3>Templates (Plantillas)</h3>
          <p>Los templates permiten escribir código genérico que funciona con diferentes tipos.</p>
          
          <h4>Función Template</h4>
          <pre><code>template &lt;typename T&gt;
T maximo(T a, T b) {
    return (a > b) ? a : b;
}

// Uso
int m1 = maximo(5, 10);           // int
double m2 = maximo(3.14, 2.71);   // double
std::string m3 = maximo("hola", "adiós");  // string</code></pre>
          
          <h4>Clase Template</h4>
          <pre><code>template &lt;typename T&gt;
class Pila {
private:
    std::vector&lt;T&gt; elementos;
    
public:
    void push(const T& elemento) {
        elementos.push_back(elemento);
    }
    
    void pop() {
        if (!elementos.empty()) {
            elementos.pop_back();
        }
    }
    
    T top() const {
        return elementos.back();
    }
    
    bool empty() const {
        return elementos.empty();
    }
};

// Uso
Pila&lt;int&gt; pilaEnteros;
Pila&lt;std::string&gt; pilaStrings;</code></pre>
          
          <h4>Template con Múltiples Parámetros</h4>
          <pre><code>template &lt;typename T, typename U&gt;
auto suma(T a, U b) -> decltype(a + b) {
    return a + b;
}

// Uso
auto resultado1 = suma(5, 3.14);      // double
auto resultado2 = suma(std::string("Hola "), 
                       std::string("Mundo"));  // string</code></pre>
          
          <h3>Template Especialización</h3>
          <pre><code>template &lt;typename T&gt;
void imprimir(T valor) {
    std::cout << valor << std::endl;
}

// Especialización para strings
template &lt;&gt;
void imprimir&lt;std::string&gt;(std::string valor) {
    std::cout << "String: " << valor << std::endl;
}</code></pre>
          
          <h3>Deducción de Tipos</h3>
          <pre><code>// auto (C++11)
auto x = 10;           // int
auto y = 3.14;         // double
auto z = "texto";      // const char*

// decltype (C++11)
int a = 5;
decltype(a) b = 10;    // b es int

// decltype(auto) (C++14)
template &lt;typename T&gt;
decltype(auto) funcion() {
    return T{};  // Preserva referencias
}</code></pre>
          
          <h3>constexpr</h3>
          <p><code>constexpr</code> indica que algo puede evaluarse en tiempo de compilación.</p>
          
          <pre><code>// Función constexpr
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

// Variable constexpr
constexpr int max_size = 100;

// Uso en tiempo de compilación
int arreglo[factorial(5)];  // 120 elementos

// if constexpr (C++17)
template &lt;typename T&gt;
void procesar(T valor) {
    if constexpr (std::is_integral_v&lt;T&gt;) {
        std::cout << "Es entero: " << valor * 2 << std::endl;
    } else {
        std::cout << "Es otro tipo: " << valor << std::endl;
    }
}</code></pre>
          
          <h3>Conceptos (C++20)</h3>
          <pre><code>#include &lt;concepts&gt;

// Concepto que verifica si un tipo es numérico
template &lt;typename T&gt;
concept Numerico = std::integral&lt;T&gt; || std::floating_point&lt;T&gt;;

// Función que usa el concepto
template &lt;Numerico T&gt;
T duplicar(T valor) {
    return valor * 2;
}</code></pre>
        `
      }
    ]
  },
  'modulo-4': {
    title: 'Módulo 4: C++ Moderno',
    lessons: [
      {
        id: 'leccion-4-1',
        title: 'Smart pointers (unique_ptr, shared_ptr, weak_ptr)',
        content: `
          <h3>Problema con Punteros Tradicionales</h3>
          <p>Los punteros tradicionales en C++ requieren gestión manual de memoria, lo que puede llevar a memory leaks:</p>
          <pre><code>void funcionPeligrosa() {
    int* ptr = new int(42);
    
    // Si hay una excepción aquí...
    procesar();
    
    delete ptr;  // Podría no ejecutarse
}</code></pre>
          
          <h3>Smart Pointers</h3>
          <p>Los smart pointers gestionan automáticamente la memoria usando RAII.</p>
          
          <h3>unique_ptr - Propiedad Única</h3>
          <pre><code>#include &lt;memory&gt;

int main() {
    // Crear unique_ptr
    std::unique_ptr&lt;int&gt; ptr1 = std::make_unique&lt;int&gt;(42);
    
    // Acceder al valor
    std::cout << *ptr1 << std::endl;  // 42
    
    // Transferir propiedad (move semantics)
    std::unique_ptr&lt;int&gt; ptr2 = std::move(ptr1);
    // ptr1 ahora es nullptr
    
    // Se libera automáticamente al salir del scope
    return 0;
}</code></pre>
          
          <h3>shared_ptr - Propiedad Compartida</h3>
          <pre><code>#include &lt;memory&gt;
#include &lt;iostream&gt;

class Recurso {
public:
    Recurso() { std::cout << "Recurso creado" << std::endl; }
    ~Recurso() { std::cout << "Recurso destruido" << std::endl; }
};

int main() {
    // Crear shared_ptr
    std::shared_ptr&lt;Recurso&gt; ptr1 = std::make_shared&lt;Recurso&gt;();
    
    {
        std::shared_ptr&lt;Recurso&gt; ptr2 = ptr1;  // Compartir
        std::cout << "Referencias: " << ptr1.use_count() << std::endl;  // 2
        
        // ptr2 se destruye, pero el recurso no porque ptr1 aún existe
    }
    
    std::cout << "Referencias: " << ptr1.use_count() << std::endl;  // 1
    
    // Se libera cuando ptr1 se destruye
    return 0;
}</code></pre>
          
          <h3>weak_ptr - Referencia Débil</h3>
          <pre><code>#include &lt;memory&gt;

int main() {
    std::shared_ptr&lt;int&gt; shared = std::make_shared&lt;int&gt;(42);
    
    // Crear weak_ptr (no incrementa el contador)
    std::weak_ptr&lt;int&gt; weak = shared;
    
    std::cout << "Referencias: " << shared.use_count() << std::endl;  // 1
    
    // Convertir weak_ptr a shared_ptr para usar
    if (auto temp = weak.lock()) {
        std::cout << "Valor: " << *temp << std::endl;
    } else {
        std::cout << "Objeto ya no existe" << std::endl;
    }
    
    shared.reset();  // Liberar recurso
    
    if (auto temp = weak.lock()) {
        // No entrará aquí porque el objeto fue liberado
    } else {
        std::cout << "El objeto fue liberado" << std::endl;
    }
    
    return 0;
}</code></pre>
          
          <h3>Comparación de Smart Pointers</h3>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th>Tipo</th>
              <th>Uso</th>
              <th>Ventajas</th>
            </tr>
            <tr>
              <td>unique_ptr</td>
              <td>Propiedad única</td>
              <td>Rápido, sin overhead</td>
            </tr>
            <tr>
              <td>shared_ptr</td>
              <td>Propiedad compartida</td>
              <td>Seguro, cuenta referencias</td>
            </tr>
            <tr>
              <td>weak_ptr</td>
              <td>Referencia no-propietaria</td>
              <td>Evita referencias circulares</td>
            </tr>
          </table>
          
          <h3>Ejemplo Completo</h3>
          <pre><code>class Nodo {
public:
    int valor;
    std::shared_ptr&lt;Nodo&gt; siguiente;
    std::weak_ptr&lt;Nodo&gt; anterior;  // Evita referencia circular
    
    Nodo(int v) : valor(v) {}
};

int main() {
    auto nodo1 = std::make_shared&lt;Nodo&gt;(1);
    auto nodo2 = std::make_shared&lt;Nodo&gt;(2);
    
    nodo1->siguiente = nodo2;
    nodo2->anterior = nodo1;  // weak_ptr, no crea referencia circular
    
    // Ambos nodos se liberan correctamente
    return 0;
}</code></pre>
        `
      },
      {
        id: 'leccion-4-2',
        title: 'Lambdas, auto, decltype',
        content: `
          <h3>Expresiones Lambda</h3>
          <p>Las lambdas permiten definir funciones anónimas inline.</p>
          
          <h4>Sintaxis Básica</h4>
          <pre><code>// Sintaxis: [capturas](parámetros) -> tipo_retorno { cuerpo }

// Ejemplo simple
auto lambda = []() {
    std::cout << "Hola desde lambda" << std::endl;
};
lambda();

// Con parámetros
auto sumar = [](int a, int b) {
    return a + b;
};
std::cout << sumar(5, 3) << std::endl;  // 8</code></pre>
          
          <h3>Capturas</h3>
          <pre><code>int x = 10;
int y = 20;

// Captura por valor
auto porValor = [x]() {
    return x;  // Copia de x
};

// Captura por referencia
auto porReferencia = [&x]() {
    x = 100;  // Modifica x original
};

// Capturar todo por valor
auto todoValor = [=]() {
    return x + y;  // Copia x e y
};

// Capturar todo por referencia
auto todoReferencia = [&]() {
    x = 100;
    y = 200;  // Modifica ambos
};

// Captura mixta
auto mixta = [x, &y]() {
    // x por valor, y por referencia
    y = x * 2;
};

// Captura con inicialización (C++14)
int z = 30;
auto conInicializacion = [x, z = z * 2]() {
    return x + z;  // z es una nueva variable
};</code></pre>
          
          <h3>Lambdas con STL</h3>
          <pre><code>#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;iostream&gt;

int main() {
    std::vector&lt;int&gt; numeros = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Filtrar números pares
    std::vector&lt;int&gt; pares;
    std::copy_if(numeros.begin(), numeros.end(),
                 std::back_inserter(pares),
                 [](int n) { return n % 2 == 0; });
    
    // Transformar
    std::transform(numeros.begin(), numeros.end(),
                   numeros.begin(),
                   [](int n) { return n * n; });  // Cuadrados
    
    // Buscar con condición
    auto it = std::find_if(numeros.begin(), numeros.end(),
                           [](int n) { return n > 50; });
    
    // Ordenar con comparador personalizado
    std::sort(numeros.begin(), numeros.end(),
              [](int a, int b) { return a > b; });  // Orden descendente
    
    return 0;
}</code></pre>
          
          <h3>auto</h3>
          <pre><code>// Deducción automática de tipos (C++11)

// Variables
auto x = 10;              // int
auto y = 3.14;            // double
auto z = std::string("Hola");  // std::string

// En bucles
std::vector&lt;int&gt; numeros = {1, 2, 3};
for (auto num : numeros) {
    std::cout << num << std::endl;
}

// Con iteradores
for (auto it = numeros.begin(); it != numeros.end(); ++it) {
    std::cout << *it << std::endl;
}

// Funciones con auto (C++14)
auto sumar(int a, int b) {
    return a + b;  // Tipo deducido: int
}

// Auto con referencias
auto& ref = numeros[0];  // Referencia al primer elemento
auto* ptr = &numeros[0];  // Puntero al primer elemento</code></pre>
          
          <h3>decltype</h3>
          <pre><code>// decltype obtiene el tipo de una expresión (C++11)

int x = 10;
decltype(x) y = 20;  // y es int

double calcular();
decltype(calcular()) resultado;  // resultado es double

// Útil en templates
template &lt;typename T, typename U&gt;
auto sumar(T a, U b) -> decltype(a + b) {
    return a + b;
}

// Preservar referencias
int& obtenerRef();
decltype(obtenerRef()) ref = obtenerRef();  // ref es int&

// Con expresiones
int a = 5, b = 10;
decltype(a + b) suma = a + b;  // suma es int</code></pre>
          
          <h3>decltype(auto) (C++14)</h3>
          <pre><code>// Combina auto y decltype

int& obtenerReferencia();

// Con auto pierde la referencia
auto valor1 = obtenerReferencia();  // int (copia)

// Con decltype(auto) preserva todo
decltype(auto) valor2 = obtenerReferencia();  // int& (referencia)

// Útil en funciones genéricas
template &lt;typename T&gt;
decltype(auto) acceder(T&& t) {
    return std::forward&lt;T&gt;(t);  // Preserva el tipo exacto
}</code></pre>
          
          <h3>Ejemplo Completo</h3>
          <pre><code>#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;iostream&gt;

template &lt;typename Contenedor&gt;
auto procesar(const Contenedor& cont) 
    -> decltype(cont.size()) {
    
    auto cantidad = cont.size();
    
    // Lambda genérico con auto
    auto imprimir = [](const auto& item) {
        std::cout << item << " ";
    };
    
    std::for_each(cont.begin(), cont.end(), imprimir);
    
    return cantidad;
}

int main() {
    std::vector&lt;int&gt; numeros = {1, 2, 3, 4, 5};
    auto tamanio = procesar(numeros);
    std::cout << "\\nTamaño: " << tamanio << std::endl;
    return 0;
}</code></pre>
        `
      },
      {
        id: 'leccion-4-3',
        title: 'Buenas prácticas y patrones',
        content: `
          <h3>Principios SOLID en C++</h3>
          
          <h4>1. Single Responsibility</h4>
          <pre><code>// Mal: Una clase hace demasiadas cosas
class Usuario {
    // Gestión de datos
    std::string nombre;
    // Validación
    bool esValido() { /* ... */ }
    // Persistencia
    void guardar() { /* ... */ }
    // Presentación
    void imprimir() { /* ... */ }
};

// Bien: Separar responsabilidades
class Usuario {
    std::string nombre;
    // Solo datos básicos
};

class ValidadorUsuario {
    bool esValido(const Usuario& u) { /* ... */ }
};

class RepositorioUsuario {
    void guardar(const Usuario& u) { /* ... */ }
};</code></pre>
          
          <h4>2. Open/Closed Principle</h4>
          <pre><code>// Extensible sin modificar código existente
class Forma {
public:
    virtual ~Forma() = default;
    virtual double area() const = 0;
};

class Circulo : public Forma {
    double radio;
public:
    double area() const override { return 3.14159 * radio * radio; }
};

class Rectangulo : public Forma {
    double ancho, alto;
public:
    double area() const override { return ancho * alto; }
};</code></pre>
          
          <h3>Rule of Zero/Three/Five</h3>
          <pre><code>// Rule of Zero: Si no necesitas gestión especial, 
//     deja que el compilador lo haga
class Simple {
    std::string nombre;  // Se gestiona automáticamente
    std::vector&lt;int&gt; datos;  // Se gestiona automáticamente
    // No necesitas destructor, copy, move, etc.
};

// Rule of Three: Si defines uno de estos, define los tres
class ConRecurso {
    int* datos;
public:
    ConRecurso() : datos(new int[100]) {}
    
    // Destructor
    ~ConRecurso() { delete[] datos; }
    
    // Copy constructor
    ConRecurso(const ConRecurso& otro) 
        : datos(new int[100]) {
        std::copy(otro.datos, otro.datos + 100, datos);
    }
    
    // Copy assignment
    ConRecurso& operator=(const ConRecurso& otro) {
        if (this != &otro) {
            delete[] datos;
            datos = new int[100];
            std::copy(otro.datos, otro.datos + 100, datos);
        }
        return *this;
    }
};

// Rule of Five: Agrega move constructor y move assignment
class ConRecursoModerno {
    std::unique_ptr&lt;int[]&gt; datos;  // Mejor: usar smart pointers
    
public:
    ConRecursoModerno() : datos(std::make_unique&lt;int[]&gt;(100)) {}
    
    // El compilador maneja todo automáticamente con unique_ptr
    // No necesitas definir los cinco especiales
};</code></pre>
          
          <h3>RAII y Gestión de Recursos</h3>
          <pre><code>// Siempre usa RAII
class Conexion {
    std::unique_ptr&lt;Socket&gt; socket;
public:
    Conexion() : socket(std::make_unique&lt;Socket&gt;()) {}
    // Se libera automáticamente
};

// Evita gestión manual
void mal() {
    Socket* sock = new Socket();
    // ... código
    delete sock;  // Puede olvidarse
}</code></pre>
          
          <h3>Nombres Descriptivos</h3>
          <pre><code>// Mal
int x;
void fn(int a);
class c;

// Bien
int numeroDeUsuarios;
void procesarUsuario(const Usuario& usuario);
class GestionadorBaseDeDatos;</code></pre>
          
          <h3>const Correctness</h3>
          <pre><code>// Marca todo como const cuando sea posible
class Calculadora {
    int valor;
public:
    // Método que no modifica el estado
    int getValor() const { return valor; }
    
    // Parámetro que no se modifica
    int sumar(const int& otro) const {
        return valor + otro;
    }
};

// Referencias const en bucles
for (const auto& item : contenedor) {
    // No se puede modificar item
}</code></pre>
          
          <h3>Manejo de Errores</h3>
          <pre><code>// Usa excepciones para errores excepcionales
class ArchivoNoEncontrado : public std::exception {
public:
    const char* what() const noexcept override {
        return "Archivo no encontrado";
    }
};

void abrirArchivo(const std::string& nombre) {
    std::ifstream archivo(nombre);
    if (!archivo.is_open()) {
        throw ArchivoNoEncontrado();
    }
    // ...
}

// Usa std::optional para valores opcionales
#include &lt;optional&gt;

std::optional&lt;int&gt; buscar(const std::vector&lt;int&gt;& numeros, int valor) {
    auto it = std::find(numeros.begin(), numeros.end(), valor);
    if (it != numeros.end()) {
        return *it;
    }
    return std::nullopt;  // No encontrado
}</code></pre>
          
          <h3>Patrón Observer</h3>
          <pre><code>#include &lt;vector&gt;
#include &lt;functional&gt;

class Observador {
public:
    virtual ~Observador() = default;
    virtual void actualizar(const std::string& evento) = 0;
};

class Sujeto {
    std::vector&lt;std::reference_wrapper&lt;Observador&gt;&gt; observadores;
    
public:
    void agregar(Observador& obs) {
        observadores.push_back(std::ref(obs));
    }
    
    void notificar(const std::string& evento) {
        for (auto& obs : observadores) {
            obs.get().actualizar(evento);
        }
    }
};</code></pre>
          
          <h3>Resumen de Buenas Prácticas</h3>
          <ul>
            <li>Usa smart pointers en lugar de punteros en crudo</li>
            <li>Prefiere referencias a punteros cuando sea posible</li>
            <li>Usa const siempre que sea posible</li>
            <li>Sigue el Rule of Zero</li>
            <li>Usa nombres descriptivos</li>
            <li>Prefiere algoritmos STL a bucles manuales</li>
            <li>Usa auto para tipos obvios</li>
            <li>Evita using namespace std en headers</li>
            <li>Usa inicialización uniforme { }</li>
            <li>Prefiere nullptr a NULL</li>
          </ul>
        `
      }
    ]
  },
  // Spring Boot Premium Course Modules
  'spring-1': {
    title: 'Módulo 1: Spring Boot Fundamentals',
    lessons: [
      {
        id: 'spring-1-1',
        title: 'Introducción a Spring Boot y configuración inicial',
        content: `
          <h3>¿Qué es Spring Boot?</h3>
          <p>Spring Boot es un framework que simplifica el desarrollo de aplicaciones Spring, eliminando la necesidad de configuración XML y proporcionando un enfoque "convención sobre configuración".</p>
          
          <h3>Crear un Proyecto Spring Boot</h3>
          <p>Puedes crear un proyecto Spring Boot de varias formas:</p>
          <ul>
            <li><strong>Spring Initializr:</strong> https://start.spring.io/</li>
            <li><strong>IDE:</strong> IntelliJ IDEA, Eclipse, VS Code</li>
            <li><strong>CLI:</strong> Spring Boot CLI</li>
          </ul>
          
          <h3>Estructura de un Proyecto Spring Boot</h3>
          <pre><code>src/
  main/
    java/
      com/example/demo/
        DemoApplication.java
    resources/
      application.properties
  test/
    java/
      com/example/demo/
        DemoApplicationTests.java</code></pre>
          
          <h3>Tu Primera Aplicación Spring Boot</h3>
          <pre><code>@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "¡Hola desde Spring Boot!";
    }
}</code></pre>
          
          <h3>Archivo application.properties</h3>
          <pre><code># Configuración del servidor
server.port=8080
server.servlet.context-path=/api

# Configuración de la aplicación
spring.application.name=mi-aplicacion
spring.profiles.active=dev</code></pre>
        `
      },
      {
        id: 'spring-1-2',
        title: 'Anotaciones principales y Dependency Injection',
        content: `
          <h3>Anotaciones Fundamentales</h3>
          <ul>
            <li><code>@SpringBootApplication</code>: Combina @Configuration, @EnableAutoConfiguration y @ComponentScan</li>
            <li><code>@RestController</code>: Combina @Controller y @ResponseBody</li>
            <li><code>@Service</code>: Marca una clase como servicio</li>
            <li><code>@Repository</code>: Marca una clase como repositorio de datos</li>
            <li><code>@Component</code>: Componente genérico de Spring</li>
          </ul>
          
          <h3>Dependency Injection</h3>
          <pre><code>@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    
    // Constructor injection (recomendado)
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    public Usuario obtenerUsuario(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new UsuarioNoEncontradoException(id));
    }
}

@Repository
public interface UsuarioRepository extends JpaRepository&lt;Usuario, Long&gt; {
    Optional&lt;Usuario&gt; findByEmail(String email);
}</code></pre>
          
          <h3>Inyección por Constructor vs Campo</h3>
          <pre><code>// Recomendado: Inyección por constructor
@Service
public class MiServicio {
    private final MiRepositorio repositorio;
    
    public MiServicio(MiRepositorio repositorio) {
        this.repositorio = repositorio;
    }
}

// ⚠️ Evitar: Inyección por campo
@Service
public class MiServicio {
    @Autowired
    private MiRepositorio repositorio;  // No recomendado
}</code></pre>
        `
      }
    ]
  },
  'spring-2': {
    title: 'Módulo 2: Spring Data JPA',
    lessons: [
      {
        id: 'spring-2-1',
        title: 'Configuración de JPA y entidades',
        content: `
          <h3>Configuración de Base de Datos</h3>
          <pre><code># application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/mi_bd
spring.datasource.username=usuario
spring.datasource.password=contraseña
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true</code></pre>
          
          <h3>Definir una Entidad</h3>
          <pre><code>@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(name = "fecha_creacion")
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
    
    // Getters y setters
    // Constructores
}</code></pre>
          
          <h3>Relaciones entre Entidades</h3>
          <pre><code>@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List&lt;Pedido&gt; pedidos = new ArrayList&lt;&gt;();
}

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}</code></pre>
        `
      },
      {
        id: 'spring-2-2',
        title: 'Repositorios y consultas personalizadas',
        content: `
          <h3>Repositorio Básico</h3>
          <pre><code>@Repository
public interface UsuarioRepository extends JpaRepository&lt;Usuario, Long&gt; {
    // Métodos automáticos: save, findById, findAll, delete, etc.
    
    // Consultas por nombre de método
    Optional&lt;Usuario&gt; findByEmail(String email);
    List&lt;Usuario&gt; findByNombreContainingIgnoreCase(String nombre);
    List&lt;Usuario&gt; findByFechaCreacionAfter(LocalDateTime fecha);
}</code></pre>
          
          <h3>Consultas JPQL</h3>
          <pre><code>@Repository
public interface UsuarioRepository extends JpaRepository&lt;Usuario, Long&gt; {
    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional&lt;Usuario&gt; buscarPorEmail(@Param("email") String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.fechaCreacion BETWEEN :inicio AND :fin")
    List&lt;Usuario&gt; buscarPorRangoFechas(
        @Param("inicio") LocalDateTime inicio,
        @Param("fin") LocalDateTime fin
    );
}</code></pre>
          
          <h3>Consultas Nativas</h3>
          <pre><code>@Repository
public interface UsuarioRepository extends JpaRepository&lt;Usuario, Long&gt; {
    @Query(value = "SELECT * FROM usuarios WHERE nombre LIKE %:patron%", 
           nativeQuery = true)
    List&lt;Usuario&gt; buscarPorPatron(@Param("patron") String patron);
}</code></pre>
        `
      }
    ]
  },
  'spring-3': {
    title: 'Módulo 3: Spring Security',
    lessons: [
      {
        id: 'spring-3-1',
        title: 'Configuración básica de seguridad',
        content: `
          <h3>Dependencia Spring Security</h3>
          <pre><code>&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-security&lt;/artifactId&gt;
&lt;/dependency&gt;</code></pre>
          
          <h3>Configuración de Seguridad</h3>
          <pre><code>@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard", true)
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}</code></pre>
        `
      },
      {
        id: 'spring-3-2',
        title: 'JWT y autenticación stateless',
        content: `
          <h3>Configuración JWT</h3>
          <pre><code>@Service
public class JwtService {
    private String secret = "mi-clave-secreta-muy-larga-y-segura";
    private long expiration = 86400000; // 24 horas
    
    public String generateToken(UserDetails userDetails) {
        Map&lt;String, Object&gt; claims = new HashMap&lt;&gt;();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map&lt;String, Object&gt; claims, String subject) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }
}</code></pre>
        `
      }
    ]
  },
  'spring-4': {
    title: 'Módulo 4: REST APIs Avanzadas',
    lessons: [
      {
        id: 'spring-4-1',
        title: 'DTOs, validación y manejo de excepciones',
        content: `
          <h3>DTOs (Data Transfer Objects)</h3>
          <pre><code>public class UsuarioDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    private String nombre;
    
    @Email(message = "Email inválido")
    @NotBlank
    private String email;
    
    // Getters y setters
}</code></pre>
          
          <h3>Controlador con Validación</h3>
          <pre><code>@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @PostMapping
    public ResponseEntity&lt;Usuario&gt; crearUsuario(
            @Valid @RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.crear(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }
}</code></pre>
          
          <h3>Manejo Global de Excepciones</h3>
          <pre><code>@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity&lt;Map&lt;String, String&gt;&gt; handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map&lt;String, String&gt; errors = new HashMap&lt;&gt;();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
}</code></pre>
        `
      }
    ]
  },
  'react-1': {
    title: 'Módulo 1: Hooks Avanzados',
    lessons: [
      {
        id: 'react-1-1',
        title: 'useReducer y gestión de estado complejo',
        content: `
          <h3>useReducer para Estado Complejo</h3>
          <pre><code>import { useReducer } from 'react';

const initialState = {
  usuarios: [],
  loading: false,
  error: null,
  filtro: ''
};

function usuarioReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, usuarios: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_FILTRO':
      return { ...state, filtro: action.payload };
    default:
      return state;
  }
}

function UsuarioList() {
  const [state, dispatch] = useReducer(usuarioReducer, initialState);
  
  const cargarUsuarios = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };
  
  return (
    &lt;div&gt;
      {state.loading && &lt;p&gt;Cargando...&lt;/p&gt;}
      {state.error && &lt;p&gt;Error: {state.error}&lt;/p&gt;}
      {state.usuarios.map(u => &lt;div key={u.id}&gt;{u.nombre}&lt;/div&gt;)}
    &lt;/div&gt;
  );
}</code></pre>
        `
      },
      {
        id: 'react-1-2',
        title: 'useMemo y useCallback para optimización',
        content: `
          <h3>useMemo para Cálculos Costosos</h3>
          <pre><code>import { useMemo } from 'react';

function ProductList({ productos, filtro }) {
  const productosFiltrados = useMemo(() => {
    console.log('Filtrando productos...');
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [productos, filtro]);
  
  return (
    &lt;div&gt;
      {productosFiltrados.map(p => (
        &lt;Producto key={p.id} producto={p} /&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>
          
          <h3>useCallback para Funciones Estables</h3>
          <pre><code>import { useCallback, useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const agregarTodo = useCallback((texto) => {
    setTodos(prev => [...prev, { id: Date.now(), texto }]);
  }, []);
  
  return (
    &lt;div&gt;
      &lt;AgregarTodoForm onAgregar={agregarTodo} /&gt;
      {todos.map(t => &lt;TodoItem key={t.id} todo={t} /&gt;)}
    &lt;/div&gt;
  );
}</code></pre>
        `
      }
    ]
  },
  'react-2': {
    title: 'Módulo 2: Context API y Estado Global',
    lessons: [
      {
        id: 'react-2-1',
        title: 'Crear y usar Context',
        content: `
          <h3>Crear un Context</h3>
          <pre><code>import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setUsuario(data.usuario);
      localStorage.setItem('token', data.token);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
  };
  
  return (
    &lt;AuthContext.Provider value={{ usuario, login, logout, loading }}&gt;
      {children}
    &lt;/AuthContext.Provider&gt;
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}</code></pre>
        `
      },
      {
        id: 'react-2-2',
        title: 'Patrones avanzados con Context',
        content: `
          <h3>Context con useReducer</h3>
          <pre><code>import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  return (
    &lt;CartContext.Provider value={{ state, dispatch }}&gt;
      {children}
    &lt;/CartContext.Provider&gt;
  );
}</code></pre>
        `
      }
    ]
  },
  'react-3': {
    title: 'Módulo 3: Performance Optimization',
    lessons: [
      {
        id: 'react-3-1',
        title: 'React.memo y optimización de renders',
        content: `
          <h3>React.memo para Componentes</h3>
          <pre><code>import { memo } from 'react';

const ProductoCard = memo(function ProductoCard({ producto, onComprar }) {
  console.log('Renderizando:', producto.nombre);
  
  return (
    &lt;div className="producto-card"&gt;
      &lt;h3&gt;{producto.nombre}&lt;/h3&gt;
      &lt;p&gt;{producto.precio}&lt;/p&gt;
      &lt;button onClick={() => onComprar(producto.id)}&gt;
        Comprar
      &lt;/button&gt;
    &lt;/div&gt;
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada
  return prevProps.producto.id === nextProps.producto.id &&
         prevProps.producto.precio === nextProps.producto.precio;
});

export default ProductoCard;</code></pre>
          
          <h3>Code Splitting con React.lazy</h3>
          <pre><code>import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Perfil = lazy(() => import('./Perfil'));

function App() {
  return (
    &lt;Router&gt;
      &lt;Suspense fallback={&lt;div&gt;Cargando...&lt;/div&gt;}&gt;
        &lt;Routes&gt;
          &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
          &lt;Route path="/perfil" element={&lt;Perfil /&gt;} /&gt;
        &lt;/Routes&gt;
      &lt;/Suspense&gt;
    &lt;/Router&gt;
  );
}</code></pre>
        `
      }
    ]
  },
  'react-4': {
    title: 'Módulo 4: Testing con Jest y RTL',
    lessons: [
      {
        id: 'react-4-1',
        title: 'Configuración y primeros tests',
        content: `
          <h3>Configuración de Jest</h3>
          <pre><code>// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}</code></pre>
          
          <h3>Test Básico de Componente</h3>
          <pre><code>import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import UsuarioCard from './UsuarioCard';

describe('UsuarioCard', () => {
  it('muestra el nombre del usuario', () => {
    const usuario = { id: 1, nombre: 'Juan', email: 'juan@test.com' };
    render(&lt;UsuarioCard usuario={usuario} /&gt;);
    
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('juan@test.com')).toBeInTheDocument();
  });
  
  it('llama a onDelete cuando se hace clic en eliminar', () => {
    const onDelete = jest.fn();
    const usuario = { id: 1, nombre: 'Juan' };
    
    render(&lt;UsuarioCard usuario={usuario} onDelete={onDelete} /&gt;);
    
    const boton = screen.getByRole('button', { name: /eliminar/i });
    boton.click();
    
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});</code></pre>
        `
      }
    ]
  }
};

const LessonContent = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [enrollment, setEnrollment] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progressPct, setProgressPct] = useState(0);
  const [message, setMessage] = useState('');
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAuthenticated) return;
        const token = localStorage.getItem('token');
        const courseRes = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}`);
        if (courseRes.ok) {
          const c = await courseRes.json();
          setCourse(c);
        }
        const myRes = await fetch(`${API_ENDPOINTS.USER_COURSES}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!myRes.ok) return;
        const my = await myRes.json();
        const en = my.find((e) => String(e.course_id) === String(courseId));
        if (!en) return;
        setEnrollment(en);
        const progRes = await fetch(API_ENDPOINTS.ENROLLMENT_PROGRESS(en.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (progRes.ok) {
          const data = await progRes.json();
          const done = new Set(
            Array.isArray(data.progress_details)
              ? data.progress_details.filter(p => p.is_completed).map(p => p.lesson_id)
              : []
          );
          setCompletedLessons(done);
          if (data.enrollment && typeof data.enrollment.progress_percentage === 'number') {
            setProgressPct(data.enrollment.progress_percentage);
          }
        }
      } catch (_) {}
    };
    load();
  }, [courseId, isAuthenticated]);

  const module = moduleContent[moduleId];


  let lesson = null;
  let sidebarLessons = [];
  const isCpp = moduleId && moduleContent[moduleId];
  if (isCpp) {
    lesson = lessonId ? module.lessons.find(l => l.id === lessonId) : null;
    sidebarLessons = module.lessons;
  } else if (course && Array.isArray(course.lessons)) {
    sidebarLessons = course.lessons.map((title, idx) => ({ id: `lesson-${idx + 1}`, title }));
    if (lessonId) {
      lesson = sidebarLessons.find(l => l.id === lessonId) || null;
    }
  }

  const isLessonCompleted = useMemo(() => {
    if (!lesson) return false;
    return completedLessons.has(lesson.id);
  }, [lesson, completedLessons]);

  const markCurrentLessonCompleted = async () => {
    if (!lesson || !enrollment) return;
    if (isLessonCompleted) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.COMPLETE_LESSON(enrollment.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson_id: lesson.id, time_spent: 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedLessons(prev => new Set([...prev, lesson.id]));
        if (typeof data.progress === 'number') setProgressPct(data.progress);
        setMessage('Lección marcada como completada');
        setTimeout(() => setMessage(''), 2500);
      } else {
        setMessage(data.error || 'No se pudo marcar la lección');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      setMessage('Error de red');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getSampleSnippet = (courseTitle) => {
    const t = (courseTitle || '').toLowerCase();
    if (t.includes('react')) {
      return `import React from 'react';\n\nexport default function App(){\n  return <h1>Hola React</h1>;\n}`;
    }
    if (t.includes('spring')) {
      return `@RestController\nclass HelloController {\n  @GetMapping("/hello")\n  String hello(){ return "Hola Spring"; }\n}`;
    }
    if (t.includes('c#')) {
      return `using System;\nclass Program {\n  static void Main(){ Console.WriteLine("Hola C#"); }\n}`;
    }
    if (t.includes('programación en c')) {
      return `#include <stdio.h>\nint main(){ printf("Hola C\\n"); return 0; }`;
    }
    return `// Próximamente contenido específico de este curso`;
  };

  return (
    <>
      <Header />
      {!module ? (
        <div className="lesson-content-page">
          <h2>Módulo no encontrado</h2>
          <button onClick={() => navigate(`/courses/${courseId}`)}>
            Volver al curso
          </button>
        </div>
      ) : (
      <div className="lesson-content-page">
        <div className="lesson-header">
          <button 
            className="back-button"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            ← Volver al curso
          </button>
          <h1>{module.title}</h1>
          {lesson && <h2>{lesson.title}</h2>}
        </div>
        {message && (
          <div className="course-message" style={{ gridColumn: '1 / -1' }}>{message}</div>
        )}

        <div className="lesson-sidebar">
          <h3>Lecciones del módulo</h3>
          <ul>
            {(sidebarLessons || []).map((l) => (
              <li key={l.id}>
                <Link 
                  to={`/courses/${courseId}/module/${moduleId}/lesson/${l.id}`}
                  className={lessonId === l.id ? 'active' : ''}
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lesson-main-content">
          {lesson ? (
            <>
              {/* Barra de progreso opcional aquí */}
              {typeof progressPct === 'number' && (
                <div className="course-progress" style={{ marginBottom: 20 }}>
                  <div className="progress-bar" style={{ height: 10, background: '#eee', borderRadius: 6 }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: '#2f80ed', borderRadius: 6 }} />
                  </div>
                  <p style={{ marginTop: 8 }}>{progressPct}% completado</p>
                </div>
              )}
              <div className="lesson-content">
                {isCpp ? (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                ) : (
                  <>
                    <h3>{lesson.title}</h3>
                    <p>Contenido de la lección próximamente. Mientras tanto, aquí tienes un ejemplo:</p>
                    <pre><code>{getSampleSnippet(course?.title)}</code></pre>
                  </>
                )}
              </div>
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <button
                  onClick={markCurrentLessonCompleted}
                  disabled={!enrollment || isLessonCompleted}
                  className="btn-primary"
                >
                  {isLessonCompleted ? 'Completada' : 'Marcar como completada'}
                </button>
                <button className="btn-secondary" onClick={() => navigate(`/courses/${courseId}`)}>Volver al curso</button>
              </div>
            </>
          ) : (
            <div className="lesson-list-view">
              <h2>Selecciona una lección</h2>
              <ul>
                {(sidebarLessons || []).map((l) => (
                  <li key={l.id}>
                    <Link to={`/courses/${courseId}/module/${moduleId}/lesson/${l.id}`}>
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      )}
    </>
  );
};

export default LessonContent;

