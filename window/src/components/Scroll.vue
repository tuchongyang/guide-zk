<template>
    <article class="m-scroll" ref="scrollHook">
        <slot></slot>
    </article>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'

    export default {
        props: {
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            data: {
                type: Array,
                default: function () {
                    return []
                }
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
            threshold: {
                type: Number,
                default: 50
            },
            scrollMore: {
                type: Boolean,
                default: false
            },
            beforeScroll: {
                type: Boolean,
                default: false
            }
        },
        mounted:function() {
            var _this = this;
            this.$nextTick(function() {
                _this.initScroll()
            })
        },
        methods: {
            initScroll:function() {
                var _this = this;
                this.scroll = new BScroll(this.$refs.scrollHook, {
                    probeType: this.probeType,
                    click: this.click
                })

                if (this.listenScroll) {
                    this.scroll.on('scroll', function(pos) {
                        _this.$emit('onScroll', pos)
                    })
                }

                if (this.scrollMore) {
                    this.scroll.on('scrollEnd', function() {
                        if (_this.scroll.y <= _this.scroll.maxScrollY + _this.threshold) {
                            _this.$emit('onScrollEnd')
                        }
                    })                
                }

                if (this.beforeScroll) {
                    this.scroll.on('beforeScrollStart', function() {
                        _this.$emit('onBeforeScroll')
                    })
                }
            },
            enable:function() {
                this.scroll && this.scroll.enable()
            },
            disable:function() {
                this.scroll && this.scroll.disable()
            },
            refresh:function() {
                this.scroll && this.scroll.refresh()
            },
            destroy:function() {
                this.scroll && this.scroll.destroy()
            },
            scrollToElement:function(el, args) {
                this.scroll && this.scroll.scrollToElement(el, args)
            }
        },
        watch: {
            data:function(newVal) {
                var _this = this;
                this.$nextTick(function() {
                    _this.refresh()
                })
            },
            hasMore:function(newValue) {
                console.log(newValue)
            }
        }
    }
</script>

<style scoped lang="scss">
    .m-scroll {
        height: 100%;
        overflow: hidden;
    }
</style>
