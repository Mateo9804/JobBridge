<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            // Cursos Gratuitos
            [
                'title' => 'Programación en C desde Cero',
                'description' => 'Aprende C desde los fundamentos: sintaxis, variables, funciones, punteros, memoria dinámica y estructuras de datos. Perfecto para entender los fundamentos de la programación.',
                'category' => 'programming',
                'level' => 'beginner',
                'type' => 'free',
                'duration' => '6 semanas',
                'instructor' => 'Juan Pérez',
                'lessons' => ['Introducción a C', 'Tipos de Datos y Variables', 'Estructuras de Control', 'Funciones', 'Punteros', 'Memoria Dinámica', 'Estructuras de Datos', 'Proyecto Final'],
                'price' => 0.00,
                'image_url' => null,
                'requirements' => 'No se requieren conocimientos previos de programación',
                'what_you_will_learn' => 'Dominar C, entender punteros, gestión de memoria, algoritmos fundamentales, y crear programas eficientes desde cero.',
                'enrollments_count' => 234,
                'rating' => 4.8,
                'ratings_count' => 187,
                'is_active' => true,
            ],
            [
                'title' => 'C++ Moderno y Orientado a Objetos',
                'description' => 'Domina C++ con programación orientada a objetos, STL, templates, y las características modernas de C++11/14/17. Aprende a crear software eficiente y mantenible.',
                'category' => 'programming',
                'level' => 'intermediate',
                'type' => 'free',
                'duration' => '8 semanas',
                'instructor' => 'María González',
                'lessons' => ['Fundamentos de C++', 'POO: Clases y Objetos', 'Herencia y Polimorfismo', 'Templates y STL', 'Memoria y RAII', 'Smart Pointers', 'Lambdas y C++ Moderno', 'Proyecto Completo'],
                'price' => 0.00,
                'image_url' => null,
                'requirements' => 'Conocimientos básicos de programación o haber completado el curso de C',
                'what_you_will_learn' => 'Diseñar software con POO, usar STL eficientemente, dominar templates, gestionar memoria, y aplicar las mejores prácticas de C++ moderno.',
                'enrollments_count' => 189,
                'rating' => 4.7,
                'ratings_count' => 145,
                'is_active' => true,
            ],
            [
                'title' => 'Desarrollo con C# y .NET',
                'description' => 'Aprende C# para crear aplicaciones de escritorio, web y móviles con .NET. Cubriremos desde lo básico hasta técnicas avanzadas de desarrollo empresarial.',
                'category' => 'programming',
                'level' => 'beginner',
                'type' => 'free',
                'duration' => '7 semanas',
                'instructor' => 'Carlos Rodríguez',
                'lessons' => ['Introducción a C#', 'POO en C#', 'Colecciones y LINQ', 'Excepciones y Depuración', 'Interfaces y Delegados', 'Tasks y Async/Await', 'Entity Framework', 'Proyecto .NET'],
                'price' => 0.00,
                'image_url' => null,
                'requirements' => 'Conocimientos básicos de programación',
                'what_you_will_learn' => 'Crear aplicaciones .NET, usar LINQ, programación asíncrona, trabajar con bases de datos, y desarrollar software empresarial con C#.',
                'enrollments_count' => 167,
                'rating' => 4.6,
                'ratings_count' => 128,
                'is_active' => true,
            ],

            // Cursos Premium
            [
                'title' => 'Spring Boot Avanzado para Backend Empresarial',
                'description' => 'Construye aplicaciones backend robustas y escalables con Spring Boot. Aprende microservicios, seguridad, testing, y despliegue en producción.',
                'category' => 'backend',
                'level' => 'intermediate',
                'type' => 'premium',
                'duration' => '10 semanas',
                'instructor' => 'Pedro Sánchez',
                'lessons' => ['Spring Boot Fundamentals', 'Spring Data JPA', 'Spring Security', 'REST APIs Avanzadas', 'Testing con JUnit y Mockito', 'Microservicios', 'Docker y Deployment', 'Monitoring y Observabilidad', 'Proyecto Empresarial'],
                'price' => 89.99,
                'image_url' => null,
                'requirements' => 'Conocimientos de Java y programación orientada a objetos',
                'what_you_will_learn' => 'Crear backends escalables con Spring Boot, implementar seguridad, testing profesional, microservicios, y desplegar en producción.',
                'enrollments_count' => 78,
                'rating' => 4.9,
                'ratings_count' => 62,
                'is_active' => true,
            ],
            [
                'title' => 'React Avanzado: Desarrollo Profesional',
                'description' => 'Domina React con hooks modernos, context API, performance optimization, testing, y arquitecturas escalables. Crea aplicaciones de nivel profesional.',
                'category' => 'frontend',
                'level' => 'intermediate',
                'type' => 'premium',
                'duration' => '9 semanas',
                'instructor' => 'Sofia López',
                'lessons' => ['Hooks Avanzados', 'Context API y Estado Global', 'React Router Avanzado', 'Performance Optimization', 'Testing con Jest y RTL', 'Custom Hooks', 'Arquitectura de Componentes', 'Next.js y SSR', 'Proyecto Portfolio'],
                'price' => 79.99,
                'image_url' => null,
                'requirements' => 'Conocimientos de JavaScript ES6+, HTML y CSS',
                'what_you_will_learn' => 'Dominar React moderno, optimizar performance, testing profesional, arquitecturas escalables, y crear aplicaciones production-ready.',
                'enrollments_count' => 156,
                'rating' => 4.8,
                'ratings_count' => 124,
                'is_active' => true,
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}

