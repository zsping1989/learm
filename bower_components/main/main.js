/**
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){

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
        if(!config){
            return old_config;
        }
        for (var i in old_config){
            if(typeof config[i] != 'undefined'){
                old_config[i] = config[i];
            }
        }
        return old_config;
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
            primary_key : 'id', //主键
            parent_key : 'parent_id' //父级字段

        };

        //将数据某一列作key
        var keyBy = function (datas,key,childrens_key,prefix){
            prefix = prefix || 'id_';
            prefix = prefix+'';//字符串类型
            var result = {};
            datas.map(function(item){
                if(typeof item[childrens_key]=="object" && item[childrens_key].length){
                    item[childrens_key]=keyBy(item[childrens_key],key,childrens_key,prefix);
                }
                result[prefix+item[key]] = item;
            });
            return result;
        };

        return {
            restrict: 'A', //属性
            template:'<span ng-repeat="(key,value) in seleceLength">'+
                        '<label>{{config[\'label\'][key]}}</label>'+
                        '<select name="{{config[\'element_name\']}}"  ng-model="area[key]" ng-change="change(area[key],key)" >'+
                            '<option value="">请选择</option>'+
                            '<option ng-repeat="x in value" value="{{x[config[\'value\']]}}">{{x[config[\'show\']]}}</option>'+
                        '</select>'+
                    '</span>',
            link: function ($scope,$element, $attr) {
                var main_config;
                //没有定义配置
                if(typeof $attr[prefixKey('MultilevelMoveConfig')] == 'undefined' || !$attr[prefixKey('MultilevelMoveConfig')]){
                    main_config = null;
                }else {
                    var str = 'main_config = typeof '+$attr[prefixKey('MultilevelMoveConfig')]+' =="undefined" ? null : '+$attr[prefixKey('MultilevelMoveConfig')]+';';
                    //定义配置且是json时
                    if($attr[prefixKey('MultilevelMoveConfig')]!='config' && eval(str)){
                        main_config = main_config || null;
                    }else {
                        main_config = typeof $scope[$attr[prefixKey('MultilevelMoveConfig')]] == 'undefined' ? null : $scope[$attr[prefixKey('MultilevelMoveConfig')]];
                    }
                }
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
                }

                //监听数据改变
                $scope.$watch($attr[prefixKey('MultilevelMove')], function (value) {
                    $scope.datas = keyBy(value,$scope.config['value'],$scope.config['childrens_key']); //将主键设置成key标记
                    $scope.seleceLength = [$scope.datas]; //默认显示第一级
                    $scope.area = [];  //选择的值
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
