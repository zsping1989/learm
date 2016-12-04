<?php
/**
 * Created by PhpStorm.
 * User: zhangshiping
 * Date: 2016/12/3
 * Time: 22:13
 * 注册模式
 * 将一些对象提前创建并保持起来
 */
namespace DesignMode;
class Register{
    /**
     * 存放创建好的对象
     * @var array
     */
    protected static $objects = [];

    /**
     * 注册对象
     * @param $alias
     * @param $object
     * @return mixed
     */
    public static function set($alias,$object){
        return self::$objects[$alias] = $object;
    }

    /**
     * 获取对象
     * @param $alias
     * @return mixed
     */
    public static function get($alias){
        return self::$objects[$alias];
    }

    /**
     * 删除对象
     * @param $alias
     */
    public static function _unset($alias){
        unset(self::$objects[$alias]);
    }
}

class Obj{

}
//提前注册对象
Register::set('obj',new Obj());
$obj = Register::get('obj');
var_dump($obj);