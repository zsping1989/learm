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
     * 多级联动
     * @type {*[]}
     */
    var ftxMultilevelMoveDirective = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
        //将数据某一列作key
        var keyBy = function (datas,key,prefix){
            prefix = prefix || 'id_';
            prefix = prefix+'';//字符串类型
            var result = {};
            datas.map(function(item){
                if(typeof item.childrens=="object" && item.childrens.length){
                    item.childrens=keyBy(item.childrens,key,prefix);
                }
                result[prefix+item[key]] = item;
            });
            return result;
        }

        return {
            restrict: 'A', //属性
            templateUrl:"./bower_components/main/multilevel-move.html",
            link: function ($scope,$element, $attr) {
                //改变值
                $scope.change = function(value,select_index){
                    //当前操作数据
                    var datas = $scope.datas;

                    for(var i=0;i<select_index;i++){
                        datas = datas['id_'+$scope.area[i]]['childrens'];
                    }
                    //选择存在子节点,添加子节点选项
                    if(typeof datas['id_'+value]=='object' && typeof datas['id_'+value]['childrens']=="object"){
                        $scope.seleceLength[select_index+1] = datas['id_'+value]['childrens'];
                        //不存在子节点,删除子节点选项
                    }else {
                        $scope.seleceLength.splice(select_index+1,$scope.seleceLength.length-(select_index+1));
                        $scope.area.splice(select_index+1,$scope.area.length-(select_index+1));
                    }
                }

                $scope.$watch($attr.ftxMultilevelMove, function (value) {
                    $scope.datas = keyBy(value,'id'); //将主键设置成key标记
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
    app.directive({ ftxMultilevelMove:ftxMultilevelMoveDirective});
})(window,window.angular);
