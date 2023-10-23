<?php

namespace App\Http\Controllers\Reset;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\RequestHelper;
use Symfony\Component\HttpFoundation\Response;

class UpdatePwdController extends Controller
{
    public function updatePassword(Request $request){
        $request = $request->all();
        return $this->validateToken($request)->count() > 0 ? $this->changePassword($request) : $this->noToken();
    }

    private function validateToken($request){
        return DB::table('password_resets')->where([
            'email' => $request['email'],
            'token' => $request['passwordToken']
        ]);
    }

    private function noToken() {
        return response()->json([
          'error' => 'Email no existe.'
        ],Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function changePassword($request) {
        $user = User::whereEmail($request['email'])->first();
        $user->update([
          'password'=>bcrypt($request['password'])
        ]);
        $this->validateToken($request)->delete();
        return response()->json([
          'data' => 'La contraseña se modificó correctamente.'
        ],Response::HTTP_CREATED);
    }
}
