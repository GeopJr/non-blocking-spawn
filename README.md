<h1 align="center">non-blocking-spawn</h1>
<h4 align="center">A Crystal shard that spawns a fiber in any worker thread BUT the current one.</h4>

## Purpose

When running Crystal with [`-Dpreview_mt`](https://crystal-lang.org/2019/09/06/parallelism-in-crystal.html) sometimes fibers spawn in the current thread that might be blocked at that moment or for the duration of the run.
This happens by design. Top level `spawn` has an option to force a fiber to spawn in the current thread (`same_thread`), but not one for the opposite (since it's probably not in high demand).
That's what this shard adds.

It's a copy of the spawn method but when `same_thread` is false, it goes through all available worker threads, filters out the current one and picks one at random to spawn the fiber in.

While it might sound a bit useless, there are legit use cases:

- GTK: The main thread is blocked and remains blocked for the whole time. Using non-blocking-spawn you can spawn fibers and be sure that all of them will execute and finish.
- Wider range of examples (see: [`./spec/non-blocking-spawn_spec.cr`](./spec/non-blocking-spawn_spec.cr)): In the spec, two of the tests are similar but one of them uses non-blocking-spawn while the other uses top level spawn. The first one finishes with `i` being equal to `4` (/default amount of worker threads) while the second one finishes with `i` being equal to `3`. This is due to one of the fibers being spawned in the current thread.

## WARNING

- PLEASE don't use with newer or older versions of Crystal without checking that the spawn method is the same as the top level one (apart from the non-blocking-thread part). This shard uses private interfaces that may break at any point without notice.

- Assumes that all crystal commands (including `spec`) are being ran with the `-Dpreview_mt` flag. The `Non::Blocking.threads` method is available to check whether there are worker threads - other than the current one - and act accordingly (probably run in sync).

## Installation

1. Add the dependency to your `shard.yml`:

```yaml
dependencies:
  non-blocking-spawn:
    github: GeopJr/non-blocking-spawn
```

2. Run `shards install`

## Usage

You can find non-blocking-spawn's docs on the sidebar.

```crystal
require "non-blocking-spawn"

Non::Blocking.spawn do
  # expensive blocking code
end

# other expensive blocking code
```

## Development

- Everything runs with the `-Dpreview_mt` flag.
- When bumping Crystal version make sure that the method matches the top level one.

## Contributing

1. Read the [Code of Conduct](https://github.com/GeopJr/non-blocking-spawn/blob/main/CODE_OF_CONDUCT.md)
2. Fork it (<https://github.com/GeopJr/non-blocking-spawn/fork>)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request
