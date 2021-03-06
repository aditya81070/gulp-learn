import gulp from 'gulp'
import browserSync from 'browser-sync'
import htmlmin from 'gulp-htmlmin'
import del from 'del'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import sorting from 'postcss-sorting'
import cleanCSS from 'gulp-clean-css'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import eslint from 'gulp-eslint'
import imagemin from 'gulp-imagemin'
const server = browserSync.create()

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/assets/styles/**/*.css',
    dest: 'dist/assets/styles/'
  },
  scripts: {
    src: 'src/assets/scripts/**/*.js',
    dest: 'dist/assets/scripts/'
  },
  images: {
    src: 'src/assets/img/**',
    dest: 'dist/assets/img/'
  }
}

const clean = () => del(['dist'])

const reload = (done) => {
  server.reload()
  done()
}

const serve = (done) => {
  server.init({
    server: {
      baseDir: './dist/'
    }
  })
  done()
}

const copyHtml = () => {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true,
      preserveLineBreaks: false
    }))
    .pipe(gulp.dest(paths.html.dest))
}

const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(postcss([
      autoprefixer(),
      sorting({
        'properties-order': 'alphabetical'
      })
    ]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest))
}

const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(eslint({
      baseConfig: {
        extends: ['eslint:recommended']
      },
      envs: ['browser'],
      rules: {
        semi: 2
      }
    }))
    .pipe(eslint.failOnError())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
}

const images = () => {
  return gulp.src(paths.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true,
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}
const watchFiles = () => {
  gulp.watch(paths.html.src, gulp.series(copyHtml, reload))
  gulp.watch(paths.styles.src, gulp.series(styles, reload))
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload))
  gulp.watch(paths.images.src, gulp.series(images, reload))
}

const dev = gulp.series(clean, scripts, styles, images, copyHtml, serve, watchFiles)
const build = gulp.series(clean, gulp.parallel(scripts, styles, images, copyHtml))
export default dev
export { build }
