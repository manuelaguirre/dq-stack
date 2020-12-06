# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

added_files = [
         ( './src/utils', 'utils' ),
         ( './src/utils/fonts', 'utils/fonts' ),
         ( './src/images', 'images' ),
         ( './src/images/icons', 'images/icons' ),
         ( './src/images/tmp', 'images/tmp' ),
         ( './src/info.py', 'info' ),
         ( './src/game_types', 'game_types' ),
         ( './src/events', 'events' ),
         ( './src/text', 'text' ),
]

a = Analysis(['src/server/main.py'],
            pathex=['/Users/sebastianfernandez/repos/Projects/defiquiz/dq-stack/dq-game',
            '/Users/sebastianfernandez/repos/Projects/defiquiz/dq-stack/dq-game/venv/lib/python3.6/site-packages'],
            binaries=[],
            datas=added_files,
            hiddenimports=['socket'],
            hookspath=[],
            runtime_hooks=[],
            excludes=[],
            win_no_prefer_redirects=False,
            win_private_assemblies=False,
            cipher=block_cipher,
            noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='defiquizz-server',
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True,
          terminal=True,
          debug=True)
coll = COLLECT(exe,
              a.binaries,
              a.zipfiles,
              a.datas,
              strip=False,
              upx=True,
              upx_exclude=[],
              name='defiquizz-server',
              debug=True)
app = BUNDLE(coll,
            name='defiquizz-server.app',
            icon=None,
            bundle_identifier=None,
            console=True,
            debug=True,
            terminal=True)
