crystal_doc_search_index_callback({"repository_name":"non-blocking-spawn","body":"<h1 align=\"center\">non-blocking-spawn</h1>\n<h4 align=\"center\">A Crystal shard that spawns a fiber in any worker thread BUT the current one.</h4>\n\n## Purpose\n\nWhen running Crystal with [`-Dpreview_mt`](https://crystal-lang.org/2019/09/06/parallelism-in-crystal.html) sometimes fibers spawn in the current thread that might be blocked at that moment or for the duration of the run.\nThis happens by design. Top level `spawn` has an option to force a fiber to spawn in the current thread (`same_thread`), but not one for the opposite (since it's probably not in high demand).\nThat's what this shard adds.\n\nIt's a copy of the spawn method but when `same_thread` is false, it goes through all available worker threads, filters out the current one and picks one at random to spawn the fiber in.\n\nWhile it might sound a bit useless, there are legit use cases:\n\n- GTK: The main thread is blocked and remains blocked for the whole time. Using non-blocking-spawn you can spawn fibers and be sure that all of them will execute and finish.\n- Wider range of examples (see: [`./spec/non-blocking-spawn_spec.cr`](./spec/non-blocking-spawn_spec.cr)): In the spec, two of the tests are similar but one of them uses non-blocking-spawn while the other uses top level spawn. The first one finishes with `i` being equal to `4` (/default amount of worker threads) while the second one finishes with `i` being equal to `3`. This is due to one of the fibers being spawned in the current thread.\n\n## WARNING\n\n- PLEASE don't use with newer or older versions of Crystal without checking that the spawn method is the same as the top level one (apart from the non-blocking-thread part). This shard uses private interfaces that may break at any point without notice.\n\n- Assumes that all crystal commands (including `spec`) are being ran with the `-Dpreview_mt` flag. The `Non::Blocking.threads` method is available to check whether there are worker threads - other than the current one - and act accordingly (probably run in sync).\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n```yaml\ndependencies:\n  non-blocking-spawn:\n    github: GeopJr/non-blocking-spawn\n```\n\n2. Run `shards install`\n\n## Usage\n\nYou can find non-blocking-spawn's docs on the sidebar.\n\n```crystal\nrequire \"non-blocking-spawn\"\n\nNon::Blocking.spawn do\n  # expensive blocking code\nend\n\n# other expensive blocking code\n```\n\n## Development\n\n- Everything runs with the `-Dpreview_mt` flag.\n- When bumping Crystal version make sure that the method matches the top level one.\n\n## Contributing\n\n1. Read the [Code of Conduct](https://github.com/GeopJr/non-blocking-spawn/blob/main/CODE_OF_CONDUCT.md)\n2. Fork it (<https://github.com/GeopJr/non-blocking-spawn/fork>)\n3. Create your feature branch (`git checkout -b my-new-feature`)\n4. Commit your changes (`git commit -am 'Add some feature'`)\n5. Push to the branch (`git push origin my-new-feature`)\n6. Create a new Pull Request\n","program":{"html_id":"non-blocking-spawn/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"locations":[],"repository_name":"non-blocking-spawn","program":true,"enum":false,"alias":false,"const":false,"types":[{"html_id":"non-blocking-spawn/Non","path":"Non.html","kind":"module","full_name":"Non","name":"Non","abstract":false,"locations":[{"filename":"src/non-blocking-spawn.cr","line_number":11,"url":"https://github.com/GeopJr/non-blocking-spawn/blob/52fc377fed99c6d67b0111e176ea715dfbaf6325/src/non-blocking-spawn.cr#L11"}],"repository_name":"non-blocking-spawn","program":false,"enum":false,"alias":false,"const":false,"types":[{"html_id":"non-blocking-spawn/Non/Blocking","path":"Non/Blocking.html","kind":"module","full_name":"Non::Blocking","name":"Blocking","abstract":false,"locations":[{"filename":"src/non-blocking-spawn.cr","line_number":11,"url":"https://github.com/GeopJr/non-blocking-spawn/blob/52fc377fed99c6d67b0111e176ea715dfbaf6325/src/non-blocking-spawn.cr#L11"}],"repository_name":"non-blocking-spawn","program":false,"enum":false,"alias":false,"const":false,"extended_modules":[{"html_id":"non-blocking-spawn/Non/Blocking","kind":"module","full_name":"Non::Blocking","name":"Blocking"}],"namespace":{"html_id":"non-blocking-spawn/Non","kind":"module","full_name":"Non","name":"Non"},"doc":"This is a fork of top level spawn,\nbut when same_thread is false, it makes sure\nthat the fiber spawns in any worker thread BUT the current one.\n\nIf only the current one is available, it falls back to leaving it up to\nCrystal::Scheduler to decide.\n\nhttps://crystal-lang.org/api/1.3.2/toplevel.html#spawn%28%2A%2Cname%3AString%3F%3Dnil%2Csame_thread%3Dfalse%2C%26block%29-class-method\n\nhttps://github.com/crystal-lang/crystal/blob/932f193ae/src/concurrent.cr#L60-L67","summary":"<p>This is a fork of top level spawn, but when same_thread is false, it makes sure that the fiber spawns in any worker thread BUT the current one.</p>","instance_methods":[{"html_id":"spawn(*,name:String?=nil,same_thread=false,&block):Fiber-instance-method","name":"spawn","doc":"Spawns a fiber in either the same worker thread or any BUT the current one.\n\nExample:\n```\nNon::Blocking.spawn do\n  loop do\n    puts \"hello world\"\n  end\nend\n```","summary":"<p>Spawns a fiber in either the same worker thread or any BUT the current one.</p>","abstract":false,"args":[{"name":"","external_name":"","restriction":""},{"name":"name","default_value":"nil","external_name":"name","restriction":"String | ::Nil"},{"name":"same_thread","default_value":"false","external_name":"same_thread","restriction":""}],"args_string":"(*, name : String? = nil, same_thread = false, &block) : Fiber","args_html":"(*, name : String? = <span class=\"n\">nil</span>, same_thread = <span class=\"n\">false</span>, &block) : Fiber","location":{"filename":"src/non-blocking-spawn.cr","line_number":24,"url":"https://github.com/GeopJr/non-blocking-spawn/blob/52fc377fed99c6d67b0111e176ea715dfbaf6325/src/non-blocking-spawn.cr#L24"},"def":{"name":"spawn","args":[{"name":"","external_name":"","restriction":""},{"name":"name","default_value":"nil","external_name":"name","restriction":"String | ::Nil"},{"name":"same_thread","default_value":"false","external_name":"same_thread","restriction":""}],"splat_index":0,"yields":0,"block_arg":{"name":"block","external_name":"block","restriction":""},"return_type":"Fiber","visibility":"Public","body":"fiber = Fiber.new(name, &block)\nif same_thread\n  (fiber.@current_thread).set(Thread.current)\nelse\n  non_blocking_threads = threads\n  if non_blocking_threads.size == 0\n  else\n    (fiber.@current_thread).set(non_blocking_threads.sample)\n  end\nend\nCrystal::Scheduler.enqueue(fiber)\nfiber\n"}},{"html_id":"threads:Array(Thread)-instance-method","name":"threads","doc":"Returns the amount of available worker threads excluding the current one.\n\nExample:\n```\nputs Non::Blocking.threads.size\n```","summary":"<p>Returns the amount of available worker threads excluding the current one.</p>","abstract":false,"location":{"filename":"src/non-blocking-spawn.cr","line_number":44,"url":"https://github.com/GeopJr/non-blocking-spawn/blob/52fc377fed99c6d67b0111e176ea715dfbaf6325/src/non-blocking-spawn.cr#L44"},"def":{"name":"threads","return_type":"Array(Thread)","visibility":"Public","body":"threads = [] of Thread\nThread.unsafe_each do |thread|\n  if thread == Thread.current\n    next\n  end\n  threads << thread\nend\nthreads\n"}}]}]}]}})