<?php namespace UnifySchool;

use Illuminate\Support\Str;
use UnifySchool\Entities\School\CacheModelObserver;
use UnifySchool\Entities\School\ScopedBehaviour;
use UnifySchool\Entities\School\ScopedClassStudent;
use UnifySchool\Entities\School\ScopedCourse;
use UnifySchool\Entities\School\ScopedCourseCategory;
use UnifySchool\Entities\School\ScopedGradeAssessmentSystem;
use UnifySchool\Entities\School\ScopedGradingSystem;
use UnifySchool\Entities\School\ScopedSchoolCategory;
use UnifySchool\Entities\School\ScopedSchoolCategoryArm;
use UnifySchool\Entities\School\ScopedSchoolCategoryArmSubdivision;
use UnifySchool\Entities\School\ScopedSchoolType;
use UnifySchool\Entities\School\ScopedSession;
use UnifySchool\Entities\School\ScopedSkill;
use UnifySchool\Entities\School\ScopedStaff;
use UnifySchool\Entities\School\ScopedStudent;
use UnifySchool\Entities\School\ScopedSubSessionType;
use UnifySchool\Events\TertiaryOrNonTertiarySchoolTypeDetected;

/**
 * UnifySchool\School
 *
 * @property integer $id
 * @property string $slug
 * @property string $name
 * @property string $city
 * @property string $state
 * @property string $country
 * @property string $hashcode
 * @property string $school_object
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereCity($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereState($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereCountry($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereHashcode($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereSchoolObject($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereUpdatedAt($value)
 * @property integer $school_type_id
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereSchoolTypeId($value)
 * @method static \UnifySchool\School bySlug($slug)
 * @property integer $state_id
 * @property integer $country_id
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereStateId($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereCountryId($value)
 * @property-read \UnifySchool\SchoolType $school_type
 * @property-read \Illuminate\Database\Eloquent\Collection|\UnifySchool\Entities\School\SchoolAdministrator[] $administrators
 * @property-read \UnifySchool\Entities\School\SchoolAdministrator $administrator
 * @property-read mixed $website
 * @property-read mixed $admin_website
 * @property-read mixed $student_website
 * @method static \UnifySchool\School withData()
 * @property boolean $active
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereActive($value)
 * @method static \UnifySchool\School isActive()
 * @method static \UnifySchool\School isNotActive()
 * @property-read \UnifySchool\Entities\School\ScopedSessionType $session_type
 * @property-read \Illuminate\Database\Eloquent\Collection|\UnifySchool\Entities\School\ScopedSession[] $sessions
 * @property-read SchoolProfile $school_profile
 * @property array $modules
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereModules($value)
 * @property boolean $first_login
 * @property boolean $setup_complete
 * @property-read mixed $loaded_modules
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereFirstLogin($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\School whereSetupComplete($value)
 */
class School extends BaseModel
{
    public static $relationData = [
        'country',
        'state',
        'administrator',
        'administrators',
        'school_type',
        'sessions',
        'school_profile',
        'session_type',
        'session_type.sub_sessions',
        'school_type.session_type',
        'school_type.school_categories',
        'school_type.school_categories.school_category_arms',
        'school_type.school_categories.scoped_course_categories',
        'school_type.school_categories.scoped_courses',
        'school_type.school_categories.school_category_arms.school_category_arm_subdivisions'
    ];
    protected $guarded = ['id', 'slug', 'hashcode'];

    protected $casts = [
        'school_object' => 'object',
        'active' => 'boolean',
        'first_login' => 'boolean',
        'setup_complete' => 'boolean',
        'modules' => 'array',
    ];

    protected $appends = ['website', 'admin_website', 'student_website', 'loaded_modules'];

    public static function boot()
    {
        parent::boot();

        static::creating(function (School $model) {
            if ($model->isDirty('name')) {
                return $model->generateSlug();
            }
        });

        static::deleting(function (School $model) {
            \DB::transaction(function() use ($model) {
                SchoolProfile::whereSchoolId($model->id)->delete();
                ScopedSchoolType::whereSchoolId($model->id)->delete();
                ScopedStudent::whereSchoolId($model->id)->delete();
                ScopedSession::whereSchoolId($model->id)->delete();
                ScopedBehaviour::whereSchoolId($model->id)->delete();
                ScopedClassStudent::whereSchoolId($model->id)->delete();
                ScopedCourse::whereSchoolId($model->id)->delete();
                ScopedCourseCategory::whereSchoolId($model->id)->delete();
                ScopedGradeAssessmentSystem::whereSchoolId($model->id)->delete();
                ScopedGradingSystem::whereSchoolId($model->id)->delete();
                ScopedSchoolCategory::whereSchoolId($model->id)->delete();
                ScopedSchoolCategoryArm::whereSchoolId($model->id)->delete();
                ScopedSchoolCategoryArmSubdivision::whereSchoolId($model->id)->delete();
                ScopedSkill::whereSchoolId($model->id)->delete();
                ScopedStaff::whereSchoolId($model->id)->delete();
                ScopedSubSessionType::whereSchoolId($model->id)->delete();
            });
        });

        static::observe(new CacheModelObserver());
    }

    private function generateSlug()
    {
        $this->attributes['slug'] = Str::slug($this->name . ' ' . $this->city . ' ' . $this->state->short_code . ' ' . $this->country->short_code);

        if (!is_null(static::whereSlug($this->attributes['slug'])->first())) {
            return false;
        }
        return true;
    }

    public function scopeBySlug($query, $slug)
    {
        return $query->where('slug', $slug)
                     ->with(static::$relationData)
                     ->first();
    }

    public function scopeIsActive($query)
    {
        return $query->whereActive(true);
    }

    public function scopeIsNotActive($query)
    {
        return $query->whereActive(false);
    }

    public function scopeWithData($query)
    {
        return $query->with(static::$relationData);
    }

    public function country()
    {
        return $this->belongsTo('UnifySchool\Country');
    }

    public function state()
    {
        return $this->belongsTo('UnifySchool\State');
    }

    public function school_type()
    {
        return $this->belongsTo('UnifySchool\Entities\School\ScopedSchoolType', 'school_type_id');
    }

    public function administrators()
    {
        return $this->hasMany('UnifySchool\Entities\School\SchoolAdministrator');
    }

    public function session_type()
    {
        return $this->hasOne('UnifySchool\Entities\School\ScopedSessionType');
    }

    public function sessions()
    {
        return $this->hasMany('UnifySchool\Entities\School\ScopedSession');
    }

    public function school_profile()
    {
        return $this->hasOne(SchoolProfile::class);
    }

    public function administrator()
    {
        return $this->hasOne('UnifySchool\Entities\School\SchoolAdministrator');
    }

    public function getWebsiteAttribute()
    {
        $domain = \Config::get('unify.domain');

        return "http://{$this->slug }.{$domain}/home";
    }

    public function getAdminWebsiteAttribute()
    {
        $domain = \Config::get('unify.domain');

        return "http://{$this->slug }.{$domain}/admin/dashboard";
    }

    public function getStudentWebsiteAttribute()
    {
        $domain = \Config::get('unify.domain');


        return "http://{$this->slug }.{$domain}/students";
    }

    public function setActivateState($active)
    {
        $this->active = $active;
        $this->save();
    }

    public function setSchoolType(ScopedSchoolType $schoolType)
    {
        $this->school_type_id = $schoolType->id;
        $this->save();

        if ($schoolType->name != SchoolType::SCHOOL_CUSTOM) {
            \Event::fire(new TertiaryOrNonTertiarySchoolTypeDetected($this));
        }
    }

    public function getLoadedModulesAttribute()
    {
        $modules = [];
        if (empty($this->modules))
            return $modules;

        foreach ($this->modules as $key => $value) {
            if (is_bool($value) && $value && is_numeric($key)) {
                $modules[] = Module::find($key);
            }
        }

        return $modules;
    }

    public static function table()
    {
        $s = new static;
        return $s->getTable();
    }
}
