<?php namespace UnifySchool;

/**
 * UnifySchool\SchoolCategoryArmSubdivision
 *
 * @property integer $id
 * @property integer $school_category_arm_id
 * @property string $name
 * @property string $display_name
 * @property string $meta
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereSchoolCategoryArmId($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereDisplayName($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereMeta($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\UnifySchool\SchoolCategoryArmSubdivision whereUpdatedAt($value)
 * @property-read \UnifySchool\SchoolCategoryArm $school_category_arm
 */
class SchoolCategoryArmSubdivision extends BaseModel
{

    protected $casts = [
        'meta' => 'object'
    ];

    public function school_category_arm()
    {
        return $this->belongsTo('UnifySchool\SchoolCategoryArm');
    }
}
