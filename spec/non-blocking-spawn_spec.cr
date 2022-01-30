require "./spec_helper"

describe Non::Blocking do
  it "has more than one worker threads" do
    Non::Blocking.threads.size.should be > 1
  end

  # Spawns Non::Blocking.threads.size + 1 fibers in any worker thread
  # BUT the current one. Each fiber increases i by one.
  # Then does a blocking infinite loop checking whether all fibers finished or 10 seconds passed.
  # The test passes if i equals Non::Blocking.threads.size + 1
  it "spawns fibers in any thread but the current one" do
    i = 0
    finish = 0
    threads_plus_one = Non::Blocking.threads.size + 1
    threads_plus_one.times do
      Non::Blocking.spawn do
        i = i + 1
      end
    end

    safe_stop = Time.utc.to_unix_ms
    loop do
      if i == threads_plus_one || Time.utc.to_unix_ms - safe_stop > 10000
        # Set finish just in case for whatever reason a fiber finishes afterwards.
        finish = i
        break
      end
    end
    finish.should eq(threads_plus_one)
  end

  # Spawns Non::Blocking.threads.size + 1 fibers in any worker thread
  # INCLUDING the current one. Each fiber increases i by one.
  # Then does a blocking infinite loop checking whether all fibers finished or 10 seconds passed.
  # The test passes if i equals Non::Blocking.threads.size. (One less that the previous test).
  # This test proves that one fiber spawned in the current thread that was blocked.
  it "spawns fibers in any thread including the current one" do
    i = 0
    finish = 0
    threads_plus_one = Non::Blocking.threads.size + 1
    threads_plus_one.times do
      spawn do
        i = i + 1
      end
    end

    safe_stop = Time.utc.to_unix_ms
    loop do
      if i == threads_plus_one || Time.utc.to_unix_ms - safe_stop > 3000
        finish = i
        break
      end
    end
    finish.should eq(threads_plus_one - 1)
  end
end
