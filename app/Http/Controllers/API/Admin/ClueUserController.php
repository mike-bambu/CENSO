<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

use Validator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Catalogos\Clue;

use DB;

class ClueUserController extends Controller
{
    public function updateDevice(Request $request)
    {

        //$parametros = Input::all();
        $parametros = $request->all();
        $usuario = User::where('id', '=',  $parametros['user_id'])->first();
        $clue    = Clue::where('id', '=',  $parametros['clue_id'])->first();
        

        try {

            if($usuario && $clue){

            $clue_user_dispositivoId = DB::table('clue_user')
                ->where('clue_id', $clue->id)
                ->where('user_id', $usuario->id)
                ->update(['dispositivo_id' => $parametros['dispositivo_id'] ]);


                return response()->json(['data'=>$clue_user_dispositivoId],HttpResponse::HTTP_OK);

            } else{

                return response()->json(['error'=>'No se encontró el Usuario y la Clues y tampoco actualizo el ID del Dispositivo'], HttpResponse::HTTP_CONFLICT);
            }

        } catch (\Exception $e) {
            return response()->json(['error' =>$e, 404]);
        }
        
    }


}
