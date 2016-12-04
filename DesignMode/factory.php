<?php
/**
 * Created by PhpStorm.
 * User: zhangshiping
 * Date: 2016/12/3
 * Time: 22:13
 * 工厂模式模式
 * 方便管理维护创建对象
 */

namespace DesignMode;

/**
 * 模拟要创建的对象类
 * Class Obj
 */
class Obj{
    /**
     * 对象名称
     * @var string
     */
    public $name = '';
    public function __construct($name=''){
        $this->name = $name;
    }
}
/**
 * 模拟要创建的对象类改变了
 * Class Obj
 */
class Obj1{
    /**
     * 对象名称
     * @var string
     */
    public $name = '没有名字';
    public function __construct($name=''){
        $name AND $this->name = $name;
    }
}

/**
 * 创建对象工厂类
 * Class Factory
 */
class Factory{
    public static function createObj(){
        return new Obj();
        //return new Obj1();
    }
}
echo '<pre>';
$obj[] = Factory::createObj();
$obj[] = Factory::createObj();
$obj[] = Factory::createObj();
var_dump($obj);