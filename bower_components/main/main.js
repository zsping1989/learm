/**
 * Created by zhangshiping on 2017/1/8.
 */
(function(window,angular){
    //定义模块名称
    var MODULE_NAME = 'Main';
    //定义指令前缀
    var DIRECTIVE_PREFIX = 'ftx';
    var app =  angular.module('ng'+MODULE_NAME,[]);

    /**
     * 命令拼接前缀
     * @param obj
     * @returns {{}}
     */
    var prefixKey = function(key){
        return DIRECTIVE_PREFIX+key.replace(/(\w)/,function(v){return v.toUpperCase()});
    };

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
     * 配置覆盖
     */
    var overCinfig = function(old_config,config){
        for (var i in old_config){
            if(typeof config[i] != 'undefined'){
                old_config[i] = config[i];
            }
        }
        return old_config;
    }

    /**
     * 多级联动
     * @type {*[]}
     */
    var multilevelMoveDirective = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
        //默认配置
        var config = {
            show : 'name', //显示字段
            value : 'id', //值
            childrens_key : 'childrens', //子节点字段
            element_name : '', //表单节点名称
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
            templateUrl:"./bower_components/main/multilevel-move.html",
            link: function ($scope,$element, $attr) {
                $scope.config = overCinfig(config,$scope[$attr[prefixKey('MultilevelMoveConfig')]]);

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

    /**
     * 注册自定义命令
     */
    app.directive(prefixObj(
        {
            multilevelMove:multilevelMoveDirective
        }
    ));
})(window,window.angular);
