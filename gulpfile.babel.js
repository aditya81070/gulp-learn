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
    .pipe(cleanCSS({
      format: 'beautify'
    }))
    .pipe(gulp.dest(paths.styles.dest))
}

const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      warnings: 'verbose'
    }))
    .pipe(gulp.dest(paths.scripts.dest))
}

const watchFiles = () => {
  gulp.watch(paths.html.src, gulp.series(copyHtml, reload))
  gulp.watch(paths.styles.src, gulp.series(styles, reload))
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload))
}

const dev = gulp.series(clean, styles, scripts, copyHtml, serve, watchFiles)

export default dev
export { copyHtml, serve, reload, watchFiles, styles, scripts }
