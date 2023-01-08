FROM jekyll/jekyll as jekyll
WORKDIR /app
RUN  chmod 777 /app
COPY Gemfile /app
RUN bundle update
CMD jekyll serve --incremental