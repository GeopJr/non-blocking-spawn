# This is a fork of top level spawn,
# but when same_thread is false, it makes sure
# that the fiber spawns in any worker thread BUT the current one.
#
# If only the current one is available, it falls back to leaving it up to
# Crystal::Scheduler to decide.
#
# https://crystal-lang.org/api/1.5.0/toplevel.html#spawn%28%2A%2Cname%3AString%3F%3Dnil%2Csame_thread%3Dfalse%2C%26block%29-class-method
#
# https://github.com/crystal-lang/crystal/blob/932f193ae/src/concurrent.cr#L60-L67
module Non::Blocking
  extend self

  # Spawns a fiber in either the same worker thread or any BUT the current one.
  #
  # Example:
  # ```
  # Non::Blocking.spawn do
  #   loop do
  #     puts "hello world"
  #   end
  # end
  # ```
  def spawn(*, name : String? = nil, same_thread = false, &block) : Fiber
    fiber = Fiber.new(name, &block)
    if same_thread
      fiber.@current_thread.set(Thread.current)
    else
      non_blocking_threads = threads
      # If there are threads available other than the current one,
      # set fiber's thread as a random one from the array.
      fiber.@current_thread.set(non_blocking_threads.sample) unless non_blocking_threads.size == 0
    end
    Crystal::Scheduler.enqueue fiber
    fiber
  end

  # Returns the amount of available worker threads excluding the current one.
  #
  # Example:
  # ```
  # puts Non::Blocking.threads.size
  # ```
  def threads : Array(Thread)
    threads = [] of Thread
    Thread.unsafe_each do |thread|
      next if thread == Thread.current
      threads << thread
    end
    threads
  end
end
