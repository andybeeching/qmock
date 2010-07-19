# Navigate to root qmock directory in CLI and execute > rake doc

require 'rake'
require 'vendor/pdoc/lib/pdoc'

task :build_doc do
  PDoc.run({
    :source_files => [File.join(File.dirname(__FILE__), 'src', 'qmock.docs.api.js')],
    :destination => 'docs',
    :index_page => 'src/index.md',
    :syntax_highlighter => :pygments,
    :markdown_parser => :bluecloth,
    :pretty_urls => false,
    :bust_cache => true,
    :name => 'QMock',
    :version => '0.4.5',
    :copyright_notice => 'This work is licensed under the GPLv3 and MIT Licenses.' 
  })
end


desc "Empties output directory"
task :remove_doc do
  rm_rf Dir.glob(File.join('docs', '*'))
end

desc "Empties the output directory and builds the documentation."
task :doc => [:remove_doc, :build_doc]

task :compile_parser do
  require 'treetop'
  compiler = Treetop::Compiler::GrammarCompiler.new
  treetop_dir = File.expand_path(File.join(File.dirname(__FILE__), "vendor", "pdoc", "lib", "pdoc", "parser", "treetop_files"))
  Dir.glob(File.join(treetop_dir, "*.treetop")).each do |treetop_file_path|
    compiler.compile(treetop_file_path)
  end
end