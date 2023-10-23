<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',   'API\Auth\AuthController@logout');
    Route::get('perfil',   'API\Auth\AuthController@me');
});

Route::post('signin',   'API\Auth\AuthController@login');
Route::post('refresh',  'API\Auth\AuthController@refresh');

Route::post('req-password-reset', 'Reset\ResetPwdReqController@reqForgotPassword');
Route::post('update-password', 'Reset\UpdatePwdController@updatePassword');

Route::group(['middleware'=>'auth'],function($router){

    Route::apiResource('user',          'API\Admin\UserController');
    Route::apiResource('permission',    'API\Admin\PermissionController');
    Route::apiResource('role',          'API\Admin\RoleController');

    Route::apiResource('profile',       'API\ProfileController')->only([ 'show', 'update']);
    
    //Catalogos
    Route::apiResource('clues',                         'API\Catalogos\CluesController')->only([ 'index' ]);
    Route::apiResource('municipios',                    'API\Catalogos\MunicipiosController');
    Route::apiResource('localidades',                   'API\Catalogos\LocalidadesController');
    Route::apiResource('servicios',                     'API\Catalogos\ServiciosController');
    Route::apiResource('camas',                         'API\Catalogos\CamasController');
    Route::apiResource('estatus-cama',                  'API\Catalogos\EstatusCamaController');
    Route::apiResource('estados-actuales',              'API\Catalogos\EstadosActualesController');
    Route::apiResource('diagnosticos',                  'API\Catalogos\DiagnosticoController');
    Route::apiResource('metodos-gestacionales',         'API\Catalogos\MetodosGestacionalesController');
    Route::apiResource('metodos-anticonceptivos',       'API\Catalogos\MetodosAnticonceptivosController');
    Route::apiResource('factores-covid',                'API\Catalogos\FactoresCovidController');
    Route::apiResource('especialidades',                'API\Catalogos\EspecialidadesController');
    //busquedas
    Route::get('busqueda-clues',                        'API\Busquedas\BusquedaCatalogosController@getCluesAutocomplete');
    Route::get('busqueda-distritos',                    'API\Busquedas\BusquedaCatalogosController@getDistritosAutocomplete');
    Route::get('busqueda-servicios',                    'API\Busquedas\BusquedaCatalogosController@getCServiciosAutocomplete');
    Route::post('buscar-pacientes',                     'API\Busquedas\BusquedaRecursosController@busquedaPacientes');
    Route::get('ver-info-paciente/{id}',                'API\Busquedas\BusquedaRecursosController@infoPaciente');
    Route::post('catalogos',                            'API\Busquedas\BusquedaCatalogosController@getCatalogs');

    //Rutas movil
    Route::apiResource('atencion-pacientes-movil',              'API\Sistema\PacientesMovilController');
    Route::apiResource('atenciones',                           'API\Sistema\AtencionesController');

    Route::apiResource('seguimientos',                          'API\Sistema\SeguimientosController');
    Route::apiResource('seguimientos-diagnosticos',             'API\Sistema\SeguimientosDiagnosticosController');

    Route::apiResource('altas',                                 'API\Sistema\AltasController');
    Route::apiResource('altas-diagnosticos',                    'API\Sistema\AltasDiagnosticosController');    

    Route::post('update-device',                               'API\Admin\ClueUserController@updateDevice');
    Route::post('upgrade-camas',                                'API\Sistema\PacientesMovilController@actualizacionCamas');

    Route::post('sync-pacientes',                              'API\Sistema\PacientesMovilController@getDispositivosPacientes');
    Route::post('sincronizar-pacientes',                       'API\Sistema\PacientesMovilController@getSincronizarPacientes');
    Route::post('sync-altas',                                  'API\Sistema\PacientesMovilController@getDispositivosAltas');
    Route::post('update-atencion',                             'API\Sistema\AtencionesController@updateAtencion');
    Route::get('get-camas-all',                                'API\Catalogos\CamasController@getCamasAllMovil');
    Route::post('sync-atenciones-seguimiento',                 'API\Sistema\AtencionesController@getAtencionesUltimoSeguimiento');

    //documentos
    Route::apiResource('documentos-adjuntos',                                'API\Sistema\DocumentosAdjuntosController');

    //Rutas Web
    Route::apiResource('atencion-pacientes-web',      'API\Sistema\AtencionPacientesWebController');
    Route::post('lista-atencion-pacientes-web',       'API\Sistema\AtencionPacientesWebController@getAtencionesPacientes');
    Route::apiResource('ingresos-web',                'API\Sistema\IngresosWebController');

    Route::apiResource('atenciones-web',                       'API\Sistema\AtencionesWebController');
    Route::apiResource('seguimientos-web',                     'API\Sistema\SeguimientoWebController');
    Route::apiResource('alta-web',                             'API\Sistema\AltasWebController');
    //reportes
    Route::post('reporte-pacientes-hospitalizados',             'API\Reportes\ReportesController@reportePacientesHospitalizados');
    Route::post('reporte-pacientes-ambulatorios',               'API\Reportes\ReportesController@reportePacientesAmbulatorios');
    
    Route::post('camas-estatus',                               'API\Catalogos\CamasController@resumenCamasEstatus');

    //Embarazo/Puerperio
    Route::apiResource('puerperas-embarazadas',                'API\Sistema\VisitaPerperalController');
    Route::get('ver-info-paciente-egreso/{id}',                'API\Busquedas\BusquedaRecursosController@infoPacienteEgreso');

    Route::post('reporte-embarazos-hospitalizados',          'API\Reportes\EmbarazosController@reporteEmbarazosEnHospitalizacion');
    Route::post('reporte-embarazos-ambulatorios',            'API\Reportes\EmbarazosController@reporteEmbarazosAmbulatorios');

    
});

Route::middleware('auth')->get('/avatar-images', function (Request $request) {
    $avatars_path = public_path() . config('ng-client.path') . '/assets/avatars';
    $image_files = glob( $avatars_path . '/*', GLOB_MARK );

    $root_path = public_path() . config('ng-client.path');

    $clean_path = function($value)use($root_path) {
        return str_replace($root_path,'',$value);
    };
    
    $avatars = array_map($clean_path, $image_files);

    return response()->json(['images'=>$avatars], HttpResponse::HTTP_OK);
});