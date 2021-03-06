<?php namespace UnifySchool\Providers;

use Illuminate\Support\ServiceProvider;
use UnifySchool\Entities\Resources\NonTertiary\SessionGenerator;

class AppServiceProvider extends ServiceProvider
{

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * This service provider is a great spot to register your various container
     * bindings with the application. As you can see, we are registering our
     * "Registrar" implementation here. You can add your own bindings too!
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            'Illuminate\Contracts\Auth\Registrar',
            'UnifySchool\Services\Registrar'
        );

        $this->app->singleton(SessionGenerator::class, function () {
            return new SessionGenerator();
        });

        if ($this->app->environment() == 'local') {
            $this->app->register('Laracasts\Generators\GeneratorsServiceProvider');
        }
    }

}
