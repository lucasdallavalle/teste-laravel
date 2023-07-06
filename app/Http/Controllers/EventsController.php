<?php

namespace App\Http\Controllers;

use App\Models\Events;
use Illuminate\Http\Request;

class EventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $name = $request->input('name');
        $dateStart = $request->input('dateStart');
        $dateEnd = $request->input('dateEnd');

        $query = Events::select('id', 'name', 'dateStart', 'dateEnd');
        if(!empty($name)) {
            $query->where('name', 'LIKE', "%{$name}%");
        }
        if(!empty($dateStart)) {
            $query->whereDate('dateStart', '>=', "{$dateStart}");
        }
        if(!empty($dateEnd)) {
            $query->whereDate('dateEnd', '<=', "{$dateEnd}");
        }
        return $query->where('excluded', '=', false)->orderBy('dateStart', 'ASC')->orderBy('dateEnd', 'ASC')->get();
    }
    /**
    * Show the form for creating a new resource.
    */
    public function page($event)
    {
        //
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required',
            'dateStart'=>'required|date',
            'dateEnd'=>'required|date'
        ]);

        try{
            Events::create($request->post());

            return response()->json([
                'message'=>'Evento Criado com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao salvar evento.'
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Events $event)
    {
        return response()->json([
            'event'=>$event
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Events $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Events $event)
    {
        $request->validate([
            'name'=>'required',
            'dateStart'=>'required|date',
            'dateEnd'=>'required|date'
        ]);

        try{
            $event->fill($request->post())->update();

            return response()->json([
                'message'=>'Evento Atualizado com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao atualizar evento.'
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Events $event)
    {
        try{
            $event->excluded = true;
            $event->save();

            return response()->json([
                'message'=>'Evento excluído com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao excluir evento.'
            ],500);
        }
    }
}
