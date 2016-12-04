<?php
/**
 * Created by PhpStorm.
 * User: zhangshiping
 * Date: 2016/12/3
 * Time: 22:13
 * 原型模式
 * 节省创建大对象的开销
 */
namespace DesignMode;

/**
 * 模拟对象类
 * Class Obj
 */
class Obj{
    public $data = [];
    public function __construct(){
        for($i=0;$i<5;++$i){
            sleep(1);
            $this->data[] = $i;
        }
    }
}

echo '原始模式:'.date('Y-m-d H:i:s',time())."<br />\r\n";
//原始方法创建2个对象
$obj1 = new Obj();
$obj2 = new Obj();
echo '<pre>';
var_dump($obj1->data,$obj1->data);
echo date('Y-m-d H:i:s',time())."<br />\r\n";

echo '原型模式:'.date('Y-m-d H:i:s',time())."<br />\r\n";
//原始方法创建2个对象
$prototype = new Obj();

$obj3 = clone $prototype;
$obj4 = clone $prototype;
echo '<pre>';
var_dump($obj3->data,$obj4->data);
echo date('Y-m-d H:i:s',time())."<br />\r\n";


