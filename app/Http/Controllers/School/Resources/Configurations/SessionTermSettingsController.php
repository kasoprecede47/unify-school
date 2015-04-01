<?php
/**
 * Created by PhpStorm.
 * User: Ak
 * Date: 3/31/2015
 * Time: 11:46 PM
 */

namespace UnifySchool\Http\Controllers\School\Resources\Configurations;

use UnifySchool\Http\Controllers\Controller;
use UnifySchool\Http\Requests\SessionTermSettingsRequest;
use UnifySchool\Repositories\School\ScopedSessionRepository;
use UnifySchool\Repositories\School\ScopedSubSessionTypeRepository;

class SessionTermSettingsController extends Controller {

    public function index(
        ScopedSessionRepository $sessionRepository,
        ScopedSubSessionTypeRepository $subSessionTypeRepository)
    {
        $bundle = [
            'current_session' => is_null($sessionRepository->getCurrentSession()) ? null : $sessionRepository->getCurrentSession()->name,
            'current_sub_session' => is_null($subSessionTypeRepository->getCurrentSubSession()) ? null : $subSessionTypeRepository->getCurrentSubSession()->id,
        ];

        return \Response::json($bundle);
    }

    public function show($id)
    {

    }

    public function store(SessionTermSettingsRequest $request, ScopedSessionRepository $sessionRepository,
                          ScopedSubSessionTypeRepository $subSessionTypeRepository)
    {
        $sessionRepository->setCurrentSession($request->get('current_session'));
        $subSessionTypeRepository->setCurrentSubSession($request->get('current_sub_session'));
        return \Response::json(['success']);
    }

    public function update($id)
    {

    }

    public function destroy($id)
    {

    }
}