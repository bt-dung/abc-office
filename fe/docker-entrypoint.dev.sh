#!/bin/sh

# Luôn chạy npm install để đảm bảo node_modules được đồng bộ.
# Lệnh này sẽ chạy rất nhanh nếu không có gì thay đổi trong package.json.
# Nó giải quyết vấn đề "command not found" khi volume được tạo lần đầu.
echo "Ensuring node_modules are installed for frontend..."
npm install

# Sau đó, thực thi lệnh dev server. `exec` sẽ thay thế tiến trình shell bằng npm.
echo "Starting Next.js development server..."
exec npm run dev