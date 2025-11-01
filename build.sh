# Scripts de Otimização para Produção
# Sistema de Voluntários - Minificação e Compressão

echo "🚀 Iniciando otimização para produção..."

# Criar diretório dist se não existir
mkdir -p dist/css
mkdir -p dist/js
mkdir -p dist/images

echo "📁 Estrutura de diretórios criada"

# Função para minificar CSS (usando css-minify se disponível, senão manual)
minify_css() {
    local input=$1
    local output=$2
    
    if command -v css-minify &> /dev/null; then
        css-minify "$input" > "$output"
    else
        # Minificação básica manual
        sed 's/\/\*.*\*\///g' "$input" | # Remove comentários
        sed 's/[[:space:]]*{[[:space:]]*/{/g' | # Remove espaços ao redor de {
        sed 's/[[:space:]]*}[[:space:]]*/}/g' | # Remove espaços ao redor de }
        sed 's/[[:space:]]*;[[:space:]]*/;/g' | # Remove espaços ao redor de ;
        sed 's/[[:space:]]*:[[:space:]]*/:/g' | # Remove espaços ao redor de :
        tr -d '\n' > "$output" # Remove quebras de linha
    fi
    echo "✅ CSS minificado: $output"
}

# Função para minificar JavaScript
minify_js() {
    local input=$1
    local output=$2
    
    if command -v uglifyjs &> /dev/null; then
        uglifyjs "$input" --output "$output" --compress --mangle
    elif command -v terser &> /dev/null; then
        terser "$input" --output "$output" --compress --mangle
    else
        # Minificação básica manual
        sed 's/\/\/.*$//' "$input" | # Remove comentários de linha
        sed 's/\/\*.*\*\///g' | # Remove comentários de bloco
        sed 's/[[:space:]]*([[:space:]]*/(/g' | # Remove espaços ao redor de (
        sed 's/[[:space:]]*)[[:space:]]*/)/g' | # Remove espaços ao redor de )
        sed 's/[[:space:]]*{[[:space:]]*/{/g' | # Remove espaços ao redor de {
        sed 's/[[:space:]]*}[[:space:]]*/}/g' | # Remove espaços ao redor de }
        tr -d '\n' > "$output" # Remove quebras de linha
    fi
    echo "✅ JavaScript minificado: $output"
}

# Função para otimizar imagens
optimize_images() {
    local input_dir=$1
    local output_dir=$2
    
    for img in "$input_dir"/*.{jpg,jpeg,png,gif,svg}; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            
            if command -v imageoptim &> /dev/null; then
                cp "$img" "$output_dir/$filename"
                imageoptim "$output_dir/$filename"
            elif command -v optipng &> /dev/null && [[ "$img" == *.png ]]; then
                optipng -out "$output_dir/$filename" "$img"
            elif command -v jpegoptim &> /dev/null && [[ "$img" == *.jpg || "$img" == *.jpeg ]]; then
                cp "$img" "$output_dir/$filename"
                jpegoptim --max=85 "$output_dir/$filename"
            else
                # Copiar sem otimização se ferramentas não estiverem disponíveis
                cp "$img" "$output_dir/$filename"
            fi
            echo "✅ Imagem otimizada: $filename"
        fi
    done
}

# Função para minificar HTML
minify_html() {
    local input=$1
    local output=$2
    
    if command -v html-minifier &> /dev/null; then
        html-minifier --collapse-whitespace --remove-comments --minify-css --minify-js "$input" > "$output"
    else
        # Minificação básica manual
        sed 's/<!--.*-->//g' "$input" | # Remove comentários HTML
        sed 's/[[:space:]]\+/ /g' | # Múltiplos espaços vira um
        sed 's/> </></g' > "$output" # Remove espaços entre tags
    fi
    echo "✅ HTML minificado: $output"
}

echo "🎨 Minificando CSS..."
minify_css "css/style.css" "dist/css/style.min.css"
minify_css "css/accessibility.css" "dist/css/accessibility.min.css"

echo "⚡ Minificando JavaScript..."
minify_js "js/main.js" "dist/js/main.min.js"
minify_js "js/navigation.js" "dist/js/navigation.min.js"
minify_js "js/forms.js" "dist/js/forms.min.js"
minify_js "js/animations.js" "dist/js/animations.min.js"
minify_js "js/projects.js" "dist/js/projects.min.js"
minify_js "js/accessibility.js" "dist/js/accessibility.min.js"

echo "🖼️ Otimizando imagens..."
optimize_images "images" "dist/images"

echo "📄 Minificando HTML..."
minify_html "index.html" "dist/index.html"
minify_html "cadastro.html" "dist/cadastro.html"
minify_html "projeto.html" "dist/projeto.html"
minify_html "admin.html" "dist/admin.html"
minify_html "manutencao.html" "dist/manutencao.html"

# Copiar favicon
cp favicon.svg dist/

echo "📊 Calculando estatísticas de otimização..."

# Função para calcular tamanho de diretório
get_size() {
    du -sh "$1" 2>/dev/null | cut -f1
}

original_size=$(get_size ".")
dist_size=$(get_size "dist/")

echo ""
echo "📈 RELATÓRIO DE OTIMIZAÇÃO"
echo "=========================="
echo "Tamanho original: $original_size"
echo "Tamanho otimizado: $dist_size"
echo ""

# Criar arquivo de versão
echo "Versão: $(date '+%Y.%m.%d-%H%M')" > dist/VERSION
echo "Build: $(date '+%Y-%m-%d %H:%M:%S')" >> dist/VERSION
echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')" >> dist/VERSION

echo "✅ Otimização concluída!"
echo "📂 Arquivos otimizados disponíveis em: ./dist/"
echo ""
echo "🚀 Para servir em produção:"
echo "   cd dist && python3 -m http.server 8080"
echo ""