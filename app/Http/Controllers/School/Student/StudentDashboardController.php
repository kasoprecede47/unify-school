<?php
/**
 * Created by PhpStorm.
 * User: Ak
 * Date: 3/14/2015
 * Time: 7:05 PM
 */

namespace UnifySchool\Http\Controllers\School\Student;


use UnifySchool\Http\Controllers\Controller;
use UnifySchool\School;

class StudentDashboardController extends Controller
{


    function __construct()
    {
        $this->middleware('auth.student');
    }

    public function getIndex()
    {
        $school = $this->getSchool();
        $school->load(School::$relationData);

        return view('school.student.dashboard.index', compact('school'));
    }
}