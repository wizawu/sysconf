Notes on C and C++
===

Read [How to C in 2016](https://matt.sh/howto-c)

C99 has a feature called the flexible array member. It lets you declare a structure for which the last member is an array with special properties.

  * The flexible array member must be the last member of the structure.
  * There must be at least one other member.
  * The flexible array is declared like an ordinary array, except that the brackets are empty.

Somewhat oddly, C treats character constants as type int rather than type char... This characteristic of character constants makes it possible to define a character constant such as 'FATE', with four separate 8-bit ASCII codes stored in a 32-bit unit. However, attempting to assign such a character constant to a char variable results in only the last 8 bits being used, so the variable gets the value 'E'.

C99数组指定初始化

    int a[15] = { [14] = 28, [2] = 4, [9] = 7 };
    
C99符合字面量

    (struct Node) { .left = 1, .right = 2 }
    (struct Node) { .left = 1 }    /* 未初始化的成员默认为0 */

用`static`定义的函数只能在定义该函数的文件内部调用此函数。

C99支持使用`fprintf`/`scanf`输出/输入宽字符。`%lc`宽字符，`%ls`宽字符串。

C99断言`assert`允许参数为任意标量类型。

函數的默認參數需要寫在頭文件。

To summarise the above, I believe that requirement for fully-defined behaviour breaks the object-oriented programming model. The reasoning is not specific to C++. It applies to any object-oriented language with constructors and destructors.

    auto x = expreson;

    for (auto i: array_or_vector) { ... }
    
    list<vector<string>> lvs
    
    class X {
        X(const X&) = default;
        X& operator = (const X&) = delete;
    };

    // The underlying type must be one of the signed or unsigned integer types; the default is int.
    enum class Color { red, blue };
    
    decltype(a) b;
    
    class X {
        int a;
    public:
        X(int x) { ... }
        X(): X{42} { }    // Delegating constructors
    };
    
    Class X {
        int v = 2;    // ok
    };
    X obj = { .v = 20 };    // error
    
    static_assert(sizeof(long)>=8, "64-bit code generation required.");

    void g(int);
    g(nullptr);    // error: nullptr is not an int
    int i = nullptr;    // error nullptr is not an int

    // The C++11 solution is to allow {}-initializer lists for all initialization.
    int arr[2] {1, 2};
    int x{1};
    vector<string> vs {"Hello", "Hi"};
    
    R"("quoted string")"
    R"***("quoted string containing (")")***"

    int x = 99;
    auto fun1 = [](int y) { return y; }
    auto fun2 = [=](int y) { return x + y; }
    auto fun3 = [&](int y) { x = 1; return x + y; }

    tuple<string, int> t {"wiza", 17};
    get<0>(t) == "wiza";
    get<1>(t) == 17;
    
    std::thread
    std::mutex mtx;
    std::unique_lock ulock(mtx, std::defer_lock);

---

把负值赋给`unsigned`对象是完全合法的，其结果是该负值对该类型的取值个数求模后的值。<br />
变量必须且仅能定义一次，而且再使用变量之前。

要使`const`变量能够在其他的文件中访问，必须显示地指定它为`extern`。

非`const`引用只能绑定到与该引用同类型的对象。
`const`引用则可以绑定到不同但相关的类型的对象或绑定到右值。

用`class`和`struct`关键字定义类的唯一差别在于默认访问级别。

头文件应该用于声明而不是用于定义。除了可以定义类、值在编译时就知道的`const`对象和`inline`函数。

C++语言强制要求指向`const`对象的指针必须具有`const`特性。

`const`是修饰紧跟其后的类型或对象：

    const double *const pi_ptr = &pi;
    
`const double`说明`pi_ptr`所指对象`pi`为`const`，`const pi_ptr`说明`pi_ptr`为const`；

    typedef string *pstring;
    const pstring cstr;
    
同理，`pstring`为`const`，即等价于`string *const cstr`。

内联函数应该在头文件中定义，仅有函数原型是不够的。

`this`指针所保存的地址不能改变。

`const`对象只能使用`const`成员函数。

`mutable`成员即使是`const`对象的成员也是可以修改的。

类定义体外定义的形参表和函数体处于类作用域内，可以不用完全限定名。

    class student { typedef int ID; ... };
    Student::ID Student::get_id(ID x) { ... }

必须对任何`const`或者**引用类型**成员以及没有默认构造函数的类型的类类型的任何成员使用初始化式。

数据成员在初始化列表中的列出次序与成员被声明的次序可能不同，因此尽可能避免使用成员来初始化其他成员。

`static`成员函数可用“类名::”调用，但`static`数据成员必须在类定义体的外部定义（正好一次），且定义之前不允许使用该数据成员或该类。
    
    class A { static int x; };
    int A::x;
    cin >> A::x;
    A a;
    
只要初始化式是一个常量表达式，`const static`数据成员(`int`、`float`等)就可以在类的定义体中进行初始化。

    class A { const static int x = 17; }
    
但仍必须在类的定义体之外定义。

转换函数采用如下通用形式：`operator type()`，通常应定义为`const`成员。

`typename Parm::size_type`指出绑定到`Parm`类型的`size_type`成员是类型的名字。

为了防止复制，类必须显示声明其复制函数为`private`。

不允许复制的类不可作为容器的元素。

三法则：如果类需要析构函数，则它也需要复制赋值操作符和复制构造函数。

---

在类特化外部定义成员函数时，成员函数之前不能加`template<>`标记。

特化和原始模板必须在相同的命名空间内。

**非类型**模板参数只能是常整数或者指向外部链接对象的指针。
