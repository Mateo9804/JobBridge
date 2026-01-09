<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CV - {{ $cvData->full_name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #333;
            padding: 20px;
        }
        .header {
            display: flex;
            margin-bottom: 30px;
            border-bottom: 3px solid #007AFF;
            padding-bottom: 20px;
        }
        .profile-picture {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #007AFF;
            margin-right: 30px;
        }
        .header-info {
            flex: 1;
        }
        .header-info h1 {
            font-size: 28px;
            color: #007AFF;
            margin-bottom: 10px;
        }
        .contact-info {
            font-size: 10px;
            color: #666;
            margin-top: 10px;
        }
        .contact-info div {
            margin-bottom: 5px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            color: #007AFF;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #007AFF;
        }
        .section-content {
            font-size: 11px;
            line-height: 1.8;
        }
        .work-item, .education-item {
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 3px solid #e0e0e0;
        }
        .work-item h3, .education-item h3 {
            font-size: 13px;
            color: #222;
            margin-bottom: 5px;
        }
        .work-item .company, .education-item .institution {
            font-weight: bold;
            color: #007AFF;
        }
        .work-item .dates, .education-item .dates {
            font-size: 10px;
            color: #666;
            font-style: italic;
            margin: 5px 0;
        }
        .work-item .description, .education-item .description {
            margin-top: 8px;
            text-align: justify;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .skill-tag {
            background: #007AFF;
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 10px;
        }
        .language-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }
        .certification-item, .reference-item {
            margin-bottom: 15px;
            padding-left: 15px;
        }
        .certification-item h4, .reference-item h4 {
            font-size: 12px;
            color: #222;
            margin-bottom: 5px;
        }
        .professional-summary {
            text-align: justify;
            line-height: 1.8;
        }
    </style>
</head>
<body>
    <div class="header">
        @php
            $showProfilePic = false;
            if ($user->profile_picture && extension_loaded('gd')) {
                $profilePicPath = storage_path('app/public/' . $user->profile_picture);
                if (file_exists($profilePicPath)) {
                    $imageData = file_get_contents($profilePicPath);
                    $imageMime = mime_content_type($profilePicPath);
                    $imageBase64 = base64_encode($imageData);
                    $profilePicSrc = 'data:' . $imageMime . ';base64,' . $imageBase64;
                    $showProfilePic = true;
                }
            }
        @endphp
        @if($showProfilePic && isset($profilePicSrc))
            <img src="{{ $profilePicSrc }}" alt="Foto de perfil" class="profile-picture">
        @endif
        <div class="header-info">
            <h1>{{ $cvData->full_name }}</h1>
            @if($cvData->email)
                <div class="contact-info">
                    <div><strong>Email:</strong> {{ $cvData->email }}</div>
                    @if($cvData->phone)
                        <div><strong>Teléfono:</strong> {{ $cvData->phone }}</div>
                    @endif
                    @if($cvData->address)
                        <div><strong>Dirección:</strong> {{ $cvData->address }}</div>
                    @endif
                    @if($cvData->nationality)
                        <div><strong>Nacionalidad:</strong> {{ $cvData->nationality }}</div>
                    @endif
                    @if($cvData->birth_date)
                        <div><strong>Fecha de Nacimiento:</strong> {{ \Carbon\Carbon::parse($cvData->birth_date)->format('d/m/Y') }}</div>
                    @endif
                </div>
            @endif
        </div>
    </div>

    @if($cvData->professional_summary)
    <div class="section">
        <div class="section-title">Resumen Profesional</div>
        <div class="section-content professional-summary">
            {{ $cvData->professional_summary }}
        </div>
    </div>
    @endif

    @if($cvData->work_experience && count($cvData->work_experience) > 0)
    <div class="section">
        <div class="section-title">Experiencia Laboral</div>
        <div class="section-content">
            @foreach($cvData->work_experience as $work)
                <div class="work-item">
                    <h3>
                        <span class="company">{{ $work['position'] }}</span>
                        @if($work['company'])
                            - {{ $work['company'] }}
                        @endif
                    </h3>
                    @if($work['startDate'] || $work['endDate'] || $work['current'])
                        <div class="dates">
                            @if($work['startDate'])
                                {{ \Carbon\Carbon::parse($work['startDate'])->format('m/Y') }}
                            @endif
                            @if($work['current'])
                                - Actual
                            @elseif($work['endDate'])
                                - {{ \Carbon\Carbon::parse($work['endDate'])->format('m/Y') }}
                            @endif
                        </div>
                    @endif
                    @if($work['description'])
                        <div class="description">{{ $work['description'] }}</div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    @endif

    @if($cvData->education && count($cvData->education) > 0)
    <div class="section">
        <div class="section-title">Educación</div>
        <div class="section-content">
            @foreach($cvData->education as $edu)
                <div class="education-item">
                    <h3>
                        <span class="institution">{{ $edu['degree'] }}</span>
                        @if($edu['institution'])
                            - {{ $edu['institution'] }}
                        @endif
                    </h3>
                    @if($edu['field'])
                        <div><strong>Campo:</strong> {{ $edu['field'] }}</div>
                    @endif
                    @if($edu['startDate'] || $edu['endDate'] || $edu['current'])
                        <div class="dates">
                            @if($edu['startDate'])
                                {{ \Carbon\Carbon::parse($edu['startDate'])->format('m/Y') }}
                            @endif
                            @if($edu['current'])
                                - Actual
                            @elseif($edu['endDate'])
                                - {{ \Carbon\Carbon::parse($edu['endDate'])->format('m/Y') }}
                            @endif
                        </div>
                    @endif
                    @if($edu['description'])
                        <div class="description">{{ $edu['description'] }}</div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    @endif

    @if($cvData->skills && count($cvData->skills) > 0)
    <div class="section">
        <div class="section-title">Habilidades</div>
        <div class="section-content">
            <div class="skills-list">
                @foreach($cvData->skills as $skill)
                    <span class="skill-tag">{{ $skill }}</span>
                @endforeach
            </div>
        </div>
    </div>
    @endif

    @if($cvData->languages && count($cvData->languages) > 0)
    <div class="section">
        <div class="section-title">Idiomas</div>
        <div class="section-content">
            @foreach($cvData->languages as $lang)
                <div class="language-item">
                    <span><strong>{{ $lang['language'] }}</strong></span>
                    <span>{{ $lang['level'] ?? '' }}</span>
                </div>
            @endforeach
        </div>
    </div>
    @endif

    @if($cvData->certifications && count($cvData->certifications) > 0)
    <div class="section">
        <div class="section-title">Certificaciones</div>
        <div class="section-content">
            @foreach($cvData->certifications as $cert)
                <div class="certification-item">
                    <h4>{{ $cert['name'] }}</h4>
                    @if($cert['issuer'])
                        <div><strong>Emisor:</strong> {{ $cert['issuer'] }}</div>
                    @endif
                    @if($cert['date'])
                        <div><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($cert['date'])->format('d/m/Y') }}</div>
                    @endif
                    @if($cert['expiryDate'])
                        <div><strong>Válido hasta:</strong> {{ \Carbon\Carbon::parse($cert['expiryDate'])->format('d/m/Y') }}</div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    @endif

    @if($cvData->references && count($cvData->references) > 0)
    <div class="section">
        <div class="section-title">Referencias</div>
        <div class="section-content">
            @foreach($cvData->references as $ref)
                <div class="reference-item">
                    <h4>{{ $ref['name'] }}</h4>
                    @if($ref['position'])
                        <div><strong>Posición:</strong> {{ $ref['position'] }}</div>
                    @endif
                    @if($ref['company'])
                        <div><strong>Empresa:</strong> {{ $ref['company'] }}</div>
                    @endif
                    @if($ref['email'])
                        <div><strong>Email:</strong> {{ $ref['email'] }}</div>
                    @endif
                    @if($ref['phone'])
                        <div><strong>Teléfono:</strong> {{ $ref['phone'] }}</div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    @endif
</body>
</html>

