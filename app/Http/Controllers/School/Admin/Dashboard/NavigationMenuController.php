<?php
/**
 * Created by PhpStorm.
 * User: Ak
 * Date: 3/17/2015
 * Time: 10:16 PM
 */

namespace UnifySchool\Http\Controllers\School\Admin\Dashboard;


use UnifySchool\Http\Controllers\Controller;

class NavigationMenuController extends Controller
{

    public function index()
    {
        $menu = $this->getMenu();
        return \Response::json($menu);
    }

    private function getMenu()
    {
        $data = [
            [
                "text" => "Main Navigation",
                "heading" => "true"
            ],
            [
                "text" => "Home",
                "sref" => "app.home",
                "icon" => "fa fa-house"
            ],
            [
                "text" => "Classes",
                "sref" => "#",
                "icon" => "icon-folder",
                "submenu" => [
                    [
                        "text" => "JSS 1",
                        "sref" => "app.submenu"
                    ]
                ]
            ],
            [
                "text" => "Others",
                "heading" => "true"
            ],
            [
                "text" => "Settings",
                "sref" => "app.settings",
                "icon" => "fa fa-gears"
            ],
        ];

        $result = [];

        foreach ($data as $d) {
            $obj = new \stdClass();

            foreach ($d as $key => $value) {
                $obj->{$key} = $value;
            }
            $result[] = $obj;
        }

        return $result;
    }

    public function create()
    {
        //
    }

    public function store()
    {
    }

    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @param CreateSchoolRequest $request
     * @return Response
     */
    public function update($id)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}