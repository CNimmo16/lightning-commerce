<template>
    <section class="headline">
        <img class="headline__image" src="@/assets/images/headline.jpg">
        <div class="headline__main">
            <div class="headline__overlay"></div>
            <div class="headline__content">
                <h1 class="headline__content__title"><em>Intriguing</em>&nbsp; t-shirts <br> for&nbsp;<em>intriguing</em>&nbsp; people</h1>
                <router-link to="/tshirts" class="headline__content__button">Explore our T-Shirts</router-link>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    .headline {
        margin: 0;
        position: relative;
        .headline__image {
            width: 100%;
            height: 100%;
        }
        .headline__main {
            @extend %overlay;
            .headline__overlay {
                @extend %overlay;
                background-color: #000;
                opacity: 0.7;
            }
            .headline__content {
                @extend %overlay;
                padding: 10px 10%;
                color: #fff;
                .headline__content__title {
                    font-size: 80px;
                    letter-spacing: 1px;
                    line-height: 1.5;
                    font-weight: 600;
                    margin-top: 50px;
                    margin-bottom: 45px;
                    em {
                        font-weight: 400;
                    }
                }
                .headline__content__button {
                    border: none;
                    font-size: 2em;
                    font-family: "Amatic SC", serif;
                    color: #540000;
                    background: #e6e4e4;
                    font-weight: 600;
                    padding: 11px 27px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.3s;
                    &:hover {
                        background: #fff;
                    }
                }
            }
        }
        
    }
</style>