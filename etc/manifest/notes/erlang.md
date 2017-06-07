Notes on Erlang
===

Now the cost for a fun call falls roughly between the cost for a call to local function and apply/3.  
使用优先级：local函数 > fun > apply

Nowadays the compiler rewrites list comprehensions into an ordinary recursive function. Of course, using a tail-recursive function with a reverse at the end would be still faster.  
优先使用尾递归函数，列表解析也OK

On Solaris/Sparc, the body-recursive function seems to be slightly faster, even for lists with very many elements. On the x86 architecture, tail-recursion was up to about 30 percent faster. So the choice is now mostly a matter of taste. If you really do need the utmost speed, you must measure.  
But A tail-recursive function that does not need to reverse the list at the end is, of course, faster than a body-recursive function.

The ++ operator copies its left operand.  
[H|T]比[H]++T要快一点

Actually, string handling could be slow if done improperly.  
Use the re module instead of the obsolete regexp module if you are going to use regular expressions.

Since R6B the BEAM compiler is quite capable of seeing itself that a variable is not used.  
用不用 _ 去匹配，性能上都OK

Creating timers using erlang:send_after/3 and erlang:start_timer/3 is much more efficient than using the timers provided by the timer module.  
尽量使用erlang模块的计时，避免使用timer

Atoms are not garbage-collected. Once an atom is created, it will never be removed. The emulator will terminate if the limit for the number of atoms (1048576 by default) is reached.  
不要滥用atom

It is usually more efficient to split a binary using matching instead of calling the split_binary/2 function.  
binary匹配比split_binary函数给力

Calls to local or external functions (foo(), m:foo()) are the fastest kind of calls.  
Calling or applying a fun (Fun(), apply(Fun, [])) is about three times as expensive as calling a local function.  
Applying an exported function (Mod:Name(), apply(Mod, Name, [])) is about twice as expensive as calling a fun, or about six times as expensive as calling a local function.  
export的函数很慢

There are four types of binary objects internally. Two of them are containers for binary data and two of them are merely references to a part of a binary.  
详细见 doc/efficiency_guide/binaryhandling.html

In R12B, Acc will be copied only in the first iteration and extra space will be allocated at the end of the copied binary. In the next iteration, H will be written in to the extra space. When the extra space runs out, the binary will be reallocated with more extra space. The extra space allocated (or reallocated) will be twice the size of the existing binary data, or 256, whichever is larger.

```
my_list_to_binary([H|T], Acc) ->
    my_list_to_binary(T, <<Acc/binary, H>>);

my_binary_to_list(<<H, T/binary>>) ->
    [H|my_binary_to_list(T)];
```

To gain performance by using the SMP emulator, your application **must have more than one runnable Erlang process** most of the time. Otherwise, the Erlang emulator can still only run one Erlang process at the time, but you must still pay the **overhead for locking**.

Constant Erlang terms (also called **literals**) are now kept in constant pools; each loaded module has its own pool. So

```
days_in_month(M) ->
    element(M, {31,28,31,30,31,30,31,31,30,31,30,31}).
```

will no longer build the tuple every time it is called.  
But if a constant is sent to another process (or stored in an ETS table), it will be **copied**.

timer:tc/3 测量运行时间
