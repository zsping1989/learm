/**
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){'use strict';

    //定义模块名称
    var MODULE_NAME = 'Main';

    //定义指令前缀
    var DIRECTIVE_PREFIX = 'ftx';

    //所有定义指令
    var directive = {};

    /**
     * 命令拼接前缀
     * @param obj
     * @returns {{}}
     */
    var prefixKey = function(key){
        return DIRECTIVE_PREFIX+key.replace(/(\w)/,function(v){return v.toUpperCase()});
    };

    /**
     * 配置覆盖
     */
    var overCinfig = function(old_config,config){
        var result = {};
        if(!config){
            return old_config;
        }
        for (var i in old_config){
            if(typeof config[i] != 'undefined'){
                result[i] = config[i];
            }else {
                result[i] = old_config[i];
            }
        }
        return result;
    }

    /**
     * 命令拼接前缀
     * @param obj
     * @returns {{}}
     */
    var prefixObj = function(obj){
        var result = {};
        for(var key in obj){
            result[prefixKey(key)] = obj[key];
        }
        return result;
    };

    /**
     * 多级联动
     * @type {*[]}
     */
    directive.multilevelMove = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
        //默认配置
        var config = {
            show : 'name', //显示字段
            value : 'id', //值
            childrens_key : 'childrens', //子节点字段
            element_name : '', //表单节点名称
            label : [], //标签
            margin_tree : false, //边界数结构
            primary_key : 'id', //主键
            parent_key : 'parent_id' //父级字段

        };

        //将数据某一列作key
        var keyBy = function (datas,key,childrens_key,prefix){
            prefix = prefix || 'id_';
            prefix = prefix+'';//字符串类型
            var result = {};
            datas.map(function(item){
                if(typeof item[childrens_key]=="object" && item[childrens_key].length && childrens_key !=='' ){
                    item[childrens_key]=keyBy(item[childrens_key],key,childrens_key,prefix);
                }
                result[prefix+item[key]] = item;
            });
            return result;
        };

        //边界树换成树状结构
        var toTree = function(datas){
            var result = {};
            for(var key in datas){
                //result[key] =
            }

        }

        return {
            restrict: 'A', //属性
            //templateUrl : './bower_components/angular-extend/src/multilevel-move.html',
            template:'<span ng-repeat="(key,value) in seleceLength">'+
                        '<label>{{config[\'label\'][key]}}</label>'+
                        '<select name="{{config[\'element_name\']}}"  ng-model="area[key]" ng-change="change(area[key],key)" >'+
                            '<option value="">请选择</option>'+
                            '<option ng-repeat="x in value" value="{{x[config[\'value\']]}}">{{x[config[\'show\']]}}</option>'+
                        '</select>'+
                    '</span>',
            link: function ($scope,$element, $attr) {

                //用户自定义配置
                var main_config = $scope.$eval($attr[prefixKey('MultilevelMoveConfig')]);

                //现在使用配置
                $scope.config = overCinfig(config,main_config);

                //改变值
                $scope.change = function(value,select_index){

                    //当前操作数据
                    var datas = $scope.datas;

                    for(var i=0;i<select_index;i++){
                        datas = datas['id_'+$scope.area[i]][$scope.config['childrens_key']];
                    }
                    //选择存在子节点,添加子节点选项
                    if(typeof datas['id_'+value]=='object' && typeof datas['id_'+value][$scope.config['childrens_key']]=="object"){
                        $scope.seleceLength[select_index+1] = datas['id_'+value][$scope.config['childrens_key']];
                        //不存在子节点,删除子节点选项
                    }else {
                        $scope.seleceLength.splice(select_index+1,$scope.seleceLength.length-(select_index+1));
                        $scope.area.splice(select_index+1,$scope.area.length-(select_index+1));
                    }
                };

                //监听数据改变
                $scope.$watch($attr[prefixKey('MultilevelMove')], function (value) {
                    //将主键设置成key标记
                    $scope.datas = $scope.config['margin_tree'] ? toTree(keyBy($scope.$eval($attr[prefixKey('MultilevelMove')]),$scope.config['primary_key'],'')) : keyBy($scope.$eval($attr[prefixKey('MultilevelMove')]),$scope.config['value'],$scope.config['childrens_key']);

                    //选择的值
                    $scope.area = typeof $scope.area=='undefined' ? [] : $scope.area;

                    //默认显示第一级
                    $scope.seleceLength = [$scope.datas];

                    //循环显示后面层级
                    for (var i=0;i<$scope.area.length;i++){
                        if(typeof $scope.seleceLength[i]['id_'+$scope.area[i]]=='undefined'){
                            $scope.area.splice(i,$scope.area.length-i);
                            continue;
                        }
                        $scope.seleceLength[i+1] = $scope.seleceLength[i]['id_'+$scope.area[i]][$scope.config['childrens_key']];
                    }
                });

            },
            scope:true
        };
    }];

    //应用模块创建
    var app =  angular.module('ng'+MODULE_NAME,[]);

    /**
     * 注册自定义命令
     */
    app.directive(prefixObj(directive));
})(window,window.angular);
