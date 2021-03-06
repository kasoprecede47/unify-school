<?php namespace UnifySchool\Entities\School;


/**
 * UnifySchool\Entities\School\ScopedStudent
 *
 * @property integer $id
 * @property integer $school_id
 * @property string $reg_number
 * @property string $password
 * @property string $last_name
 * @property string $first_name
 * @property string $middle_name
 * @property string $other_names
 * @property string $religion
 * @property string $complexion
 * @property string $height
 * @property boolean $disabled
 * @property string $disabilities
 * @property string $blood_group
 * @property string $genotype
 * @property string $birth_date
 * @property string $place_of_birth
 * @property string $hometown
 * @property string $state_of_origin
 * @property string $country_of_origin
 * @property string $residential_address
 * @property string $residential_city
 * @property string $residential_state
 * @property string $residential_country
 * @property string $registration_date
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereSchoolId($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereRegNumber($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent wherePassword($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereLastName($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereFirstName($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereMiddleName($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereOtherNames($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereReligion($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereComplexion($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereHeight($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereDisabled($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereDisabilities($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereBloodGroup($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereGenotype($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereBirthDate($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent wherePlaceOfBirth($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereHometown($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereStateOfOrigin($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereCountryOfOrigin($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereResidentialAddress($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereResidentialCity($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereResidentialState($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereResidentialCountry($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereRegistrationDate($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereUpdatedAt($value)
 * @method static \UnifySchool\Entities\School\BaseModel unScoped()
 * @property string $remember_token
 * @property-read \UnifySchool\School $school
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereRememberToken($value)
 * @method static \UnifySchool\Entities\School\BaseModel getWithData()
 * @property string $sex
 * @property string $picture
 * @property string $medical_conditions
 * @property string $contact_phone
 * @property string $contact_email
 * @property string $contact_address
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereSex($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent wherePicture($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereMedicalConditions($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereContactPhone($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereContactEmail($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\Entities\School\ScopedStudent whereContactAddress($value)
 * @property-read \Illuminate\Database\Eloquent\Collection|ScopedClassStudent[] $class_students 
 * @property-read ScopedClassStudent::class)
 *         ->whereAcademicSession($session)
 *         ->with(ScopedClassStudent::$relati $current_class_student 
 */
class ScopedStudent extends BaseModel
{
    public static $relationships = [
//        'class_students',
        'current_class_student'
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function($model){
            if(empty($model->attributes['reg_number'])){
                $model->attributes['reg_number'] = $model->generateRegNumber();
            }
        });
        
        static::saved(function($model){
            \Cache::forget('scoped_students_'.$model->getSchool()->id);
        });
    }


    protected $casts = [
        'picture' => 'array'
    ];


    public function class_students()
    {
        return $this->hasMany(ScopedClassStudent::class);
    }
    
    public function current_class_student()
    {
        $session = ScopedSession::currentSession();
        return $this->hasOne(ScopedClassStudent::class)
        ->whereAcademicSession($session)
        ->with(ScopedClassStudent::$relationships);
    }
    
    public function generateRegNumber( $default_session_name = null)
    {
        $session_name = $this->getInitialClassStudentSessionName($default_session_name);
        $count = $this->getCountOfStudentsInSession($session_name);
        $studentCount = is_int($count) ? $count + 1 : 1;
        $regnumber = "$session_name/$studentCount";
        while(!$this->isUniqueRegNumber($regnumber)){
            $studentCount++;
            $regnumber = "$session_name/$studentCount";
        }
        return $regnumber;
    }
    
    public function getInitialClassStudentSessionName($default_session_name){
        $class_student = $this->class_students()
                    ->orderBy('created_at', 'asc')
                    ->first();
         if(empty($class_student) && empty($default_session_name)){
             $default_session_name =  ScopedSession::currentSession();
         }
                    
         return !empty($class_student) ? $class_student->academic_session : $default_session_name;
    }
    
    public function getCountOfStudentsInSession($session_name)
    {
        return ScopedClassStudent::whereAcademicSession($session_name)->count();
    }
    
    public function isUniqueRegNumber($regnumber){
        $student = static::whereRegNumber($regnumber)->first();
        return empty($student);
    }
}
