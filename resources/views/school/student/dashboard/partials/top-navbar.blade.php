<!-- START Top Navbar-->
<nav role="navigation" class="navbar topnavbar">
    <!-- START navbar header-->
    <div class="navbar-header">
        <button type="button" ng-init="navCollapsed = true" ng-click="navCollapsed = !navCollapsed"
                class="navbar-toggle collapsed">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a href="#/" class="navbar-brand">
            <div class="brand-logo">
                <img src="app/img/logo.png" alt="App Logo" class="img-responsive"/>
            </div>
            <div class="brand-logo-collapsed">
                <img src="app/img/logo-single.png" alt="App Logo" class="img-responsive"/>
            </div>
        </a>
    </div>
    <!-- END navbar header-->
    <!-- START Nav wrapper-->
    <div collapse="navCollapsed" class="collapse navbar-collapse">
        <!-- Navbar Menu -->
        <ul ng-controller="SidebarController" class="nav navbar-nav">
            <li ng-repeat="item in menuItems | limitTo: 3 " ng-class="{'dropdown': item.submenu}"
                dropdown="!!item.submenu">
                <a ng-if="!item.heading &amp;&amp; !item.submenu" ng-href="{{$state.href(item.sref)}}"
                   title="{{item.text}}">
                    <span>{{(item.translate | translate) || item.text}}</span>
                </a>
                <a dropdown-toggle="" ng-if="item.submenu">
                    <span>{{(item.translate | translate) || item.text}}</span>
                </a>
                <!-- START Dropdown menu-->
                <ul class="dropdown-menu animated fadeInUp">
                    <li ng-repeat="subitem in item.submenu">
                        <a ng-href="{{$state.href(subitem.sref)}}" title="{{subitem.text}}">
                            <span>{{(subitem.translate | translate) || subitem.text}}</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- End Navbar Menu-->
        <!-- START Right Navbar-->
        <ul class="nav navbar-nav navbar-right">
            <!-- START lock screen-->
            <li>
                <a ui-sref="page.lock" title="Lock screen">
                    <em class="icon-lock"></em>
                </a>
            </li>
            <!-- END lock screen-->
            <!-- Search icon-->
            <li>
                <a href="#" search-open="search-open">
                    <em class="icon-magnifier"></em>
                </a>
            </li>
            <!-- Fullscreen (only desktops)-->
            <li class="visible-lg">
                <a href="#" toggle-fullscreen="toggle-fullscreen">
                    <em class="fa fa-expand"></em>
                </a>
            </li>
            <!-- START Alert menu-->
            <li dropdown="" class="dropdown dropdown-list">
                <a dropdown-toggle="">
                    <em class="icon-bell"></em>

                    <div class="label label-danger">11</div>
                </a>
                <!-- START Dropdown menu-->
                <ul class="dropdown-menu animated flipInX">
                    <li>
                        <!-- START list group-->
                        <div class="list-group">
                            <!-- list item-->
                            <a href="#" class="list-group-item">
                                <div class="media-box">
                                    <div class="pull-left">
                                        <em class="fa fa-twitter fa-2x text-info"></em>
                                    </div>
                                    <div class="media-box-body clearfix">
                                        <p class="m0">New followers</p>

                                        <p class="m0 text-muted">
                                            <small>1 new follower</small>
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <!-- list item-->
                            <a href="#" class="list-group-item">
                                <div class="media-box">
                                    <div class="pull-left">
                                        <em class="fa fa-envelope fa-2x text-warning"></em>
                                    </div>
                                    <div class="media-box-body clearfix">
                                        <p class="m0">New e-mails</p>

                                        <p class="m0 text-muted">
                                            <small>You have 10 new emails</small>
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <!-- list item-->
                            <a href="#" class="list-group-item">
                                <div class="media-box">
                                    <div class="pull-left">
                                        <em class="fa fa-tasks fa-2x text-success"></em>
                                    </div>
                                    <div class="media-box-body clearfix">
                                        <p class="m0">Pending Tasks</p>

                                        <p class="m0 text-muted">
                                            <small>11 pending task</small>
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <!-- last list item -->
                            <a href="#" class="list-group-item">
                                <small translate="topbar.notification.MORE">More notifications</small>
                                <span class="label label-danger pull-right">14</span>
                            </a>
                        </div>
                        <!-- END list group-->
                    </li>
                </ul>
                <!-- END Dropdown menu-->
            </li>
            <!-- END Alert menu-->
            <!-- START Contacts button-->
            <li>
                <a href="#" toggle-state="offsidebar-open" no-persist="no-persist">
                    <em class="icon-notebook"></em>
                </a>
            </li>
            <!-- END Contacts menu-->
        </ul>
        <!-- END Right Navbar-->
    </div>
    <!-- END Nav wrapper-->
    <!-- START Search form-->
    <form role="search" action="search.html" class="navbar-form">
        <div class="form-group has-feedback">
            <input type="text" placeholder="{{ 'topbar.search.PLACEHOLDER' | translate }}" class="form-control"/>

            <div search-dismiss="search-dismiss" class="fa fa-times form-control-feedback"></div>
        </div>
        <button type="submit" class="hidden btn btn-default">Submit</button>
    </form>
    <!-- END Search form-->
</nav>
<!-- END Top Navbar-->