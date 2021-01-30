# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

added_files = [
            ( './src/utils', 'utils' ),
            ( './src/utils/fonts', 'utils/fonts' ),
            ( './src/images', 'images' ),
            ( './src/images/icons', 'images/icons' ),
            ( './src/images/tmp', 'images/tmp' ),
            ( './src/info', 'info' ),
            ( './src/game_types', 'game_types' ),
            ( './src/events', 'events' ),
            ( './src/text', 'text' ),
            ( './src/config', 'config' ),
]

a = Analysis(['src/client/main.py'],
            pathex=['C:\\Users\\sfe1\\repos\\dq-stack\\dq-game', 
            'C:\\Users\\sfe1\\AppData\\Local\\Programs\\Python\\Python36-32\\Lib\\site-packages'],
            binaries=[],
            datas=added_files,
            hiddenimports=['socket', 'requests', 'pygame' ],
            hookspath=[],
            runtime_hooks=[],
            excludes=[ ],
            win_no_prefer_redirects=False,
            win_private_assemblies=False,
            cipher=block_cipher,
            noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='defiquizz-client',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=False )
